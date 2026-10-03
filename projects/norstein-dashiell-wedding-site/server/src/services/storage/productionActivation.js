const fs = require("node:fs/promises");
const path = require("node:path");

const {
  GOOGLE_SHEETS_STORE_SCHEMA,
  GOOGLE_SHEETS_STORE_SECTIONS,
} = require("./googleSheetsStoreSchema");

const SNAPSHOT_VERSION = 1;

function quoteSheetTitle(title) {
  return `'${String(title).replace(
    /'/g,
    "''",
  )}'`;
}

function cloneRows(rows) {
  return rows.map(
    (row) => [...row],
  );
}

function rowHasData(row) {
  return row.some(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== "",
  );
}

function sameJson(
  left,
  right,
) {
  return (
    JSON.stringify(left) ===
    JSON.stringify(right)
  );
}

function parsePrivateJson(
  value,
  context,
) {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    throw new Error(
      `${context} contains missing private JSON.`,
    );
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new Error(
      `${context} contains invalid private JSON.`,
    );
  }
}

function validateExpectedProductionInvitations(
  expectedInvitations,
) {
  if (
    !Array.isArray(
      expectedInvitations,
    ) ||
    expectedInvitations.length === 0
  ) {
    throw new Error(
      "Production invitation verification requires expected configurations.",
    );
  }

  const byCode = new Map();
  const byPartyId = new Map();

  for (
    const invitation of
    expectedInvitations
  ) {
    if (
      !invitation ||
      invitation.environment !==
        "production" ||
      typeof invitation.inviteCode !==
        "string" ||
      invitation.inviteCode.trim() ===
        "" ||
      typeof invitation.partyId !==
        "string" ||
      invitation.partyId.trim() ===
        "" ||
      byCode.has(
        invitation.inviteCode,
      ) ||
      byPartyId.has(
        invitation.partyId,
      )
    ) {
      throw new Error(
        "Production invitation verification received invalid expected configuration.",
      );
    }

    byCode.set(
      invitation.inviteCode,
      invitation,
    );

    byPartyId.set(
      invitation.partyId,
      invitation,
    );
  }

  return Object.freeze({
    byCode,
    byPartyId,
  });
}

async function readGoogleSheetsStoreSnapshot({
  sheets,
  spreadsheetId,
  now = () => new Date(),
} = {}) {
  if (
    !sheets ||
    !sheets.spreadsheets ||
    !sheets.spreadsheets.values ||
    typeof sheets.spreadsheets.values.get !==
      "function"
  ) {
    throw new Error(
      "Production RSVP snapshot requires a valid Sheets client.",
    );
  }

  if (
    typeof spreadsheetId !== "string" ||
    spreadsheetId.trim() === ""
  ) {
    throw new Error(
      "Production RSVP snapshot requires a spreadsheet identifier.",
    );
  }

  const sections = {};

  for (
    const section of
    GOOGLE_SHEETS_STORE_SECTIONS
  ) {
    const response =
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range:
          `${quoteSheetTitle(
            section.title,
          )}!A1:Z`,
      });

    sections[section.title] =
      cloneRows(
        response &&
        response.data &&
        Array.isArray(
          response.data.values,
        )
          ? response.data.values
          : [],
      );
  }

  return Object.freeze({
    snapshotVersion:
      SNAPSHOT_VERSION,
    createdAt:
      now().toISOString(),
    sections:
      Object.freeze(
        Object.fromEntries(
          Object.entries(
            sections,
          ).map(
            ([title, rows]) => [
              title,
              Object.freeze(
                rows.map(
                  (row) =>
                    Object.freeze(
                      [...row],
                    ),
                ),
              ),
            ],
          ),
        ),
      ),
  });
}

function assertOperationalSectionsEmpty(
  snapshot,
) {
  for (
    const section of
    GOOGLE_SHEETS_STORE_SECTIONS
  ) {
    if (
      section ===
      GOOGLE_SHEETS_STORE_SCHEMA
        .invitations
    ) {
      continue;
    }

    const rows =
      snapshot.sections[
        section.title
      ] || [];

    if (
      rows
        .slice(1)
        .some(rowHasData)
    ) {
      throw new Error(
        "Production RSVP activation requires empty operational RSVP tables.",
      );
    }
  }

  return true;
}

function assertOperationalSectionsUnchanged(
  before,
  after,
) {
  for (
    const section of
    GOOGLE_SHEETS_STORE_SECTIONS
  ) {
    if (
      section ===
      GOOGLE_SHEETS_STORE_SCHEMA
        .invitations
    ) {
      continue;
    }

    const beforeRows =
      before.sections[
        section.title
      ] || [];

    const afterRows =
      after.sections[
        section.title
      ] || [];

    if (
      JSON.stringify(
        beforeRows,
      ) !==
      JSON.stringify(
        afterRows,
      )
    ) {
      throw new Error(
        "Production invitation activation changed RSVP operational data.",
      );
    }
  }

  return true;
}

function invitationRows(
  snapshot,
) {
  return (
    snapshot.sections[
      GOOGLE_SHEETS_STORE_SCHEMA
        .invitations.title
    ] || []
  )
    .slice(1)
    .filter(rowHasData);
}

function readStoredInvitationIndexes(
  snapshot,
) {
  const byCode = new Map();
  const byPartyId = new Map();

  for (
    const row of
    invitationRows(snapshot)
  ) {
    const [
      inviteCode,
      partyId,
      configurationJson,
    ] = row;

    if (
      typeof inviteCode !==
        "string" ||
      inviteCode.trim() === "" ||
      typeof partyId !==
        "string" ||
      partyId.trim() === "" ||
      byCode.has(inviteCode) ||
      byPartyId.has(partyId)
    ) {
      throw new Error(
        "Production invitation synchronization found duplicate or invalid stored invitation rows.",
      );
    }

    const configuration =
      parsePrivateJson(
        configurationJson,
        "Production invitation synchronization",
      );

    if (
      !configuration ||
      typeof configuration !==
        "object" ||
      configuration.inviteCode !==
        inviteCode ||
      configuration.partyId !==
        partyId
    ) {
      throw new Error(
        "Production invitation synchronization found an inconsistent stored invitation configuration.",
      );
    }

    const record =
      Object.freeze({
        inviteCode,
        partyId,
        configuration,
      });

    byCode.set(
      inviteCode,
      record,
    );

    byPartyId.set(
      partyId,
      record,
    );
  }

  return Object.freeze({
    byCode,
    byPartyId,
  });
}

function directOperationalPartyId(
  row,
  sectionTitle,
) {
  const partyId = row[0];

  if (
    typeof partyId !== "string" ||
    partyId.trim() === ""
  ) {
    throw new Error(
      `Production invitation synchronization found operational RSVP data without a party identifier in ${sectionTitle}.`,
    );
  }

  return partyId;
}

function submissionRecordPartyId(
  row,
) {
  const submissionKey = row[0];

  if (
    typeof submissionKey !==
      "string" ||
    submissionKey.trim() === ""
  ) {
    throw new Error(
      "Production invitation synchronization found a submission record without a submission key.",
    );
  }

  const separatorIndex =
    submissionKey.indexOf(":");

  const keyPartyId =
    separatorIndex > 0
      ? submissionKey.slice(
          0,
          separatorIndex,
        )
      : "";

  const record =
    parsePrivateJson(
      row[2],
      "Production invitation synchronization submission record",
    );

  const jsonPartyId =
    record &&
    typeof record.partyId ===
      "string"
      ? record.partyId.trim()
      : "";

  if (
    keyPartyId === "" &&
    jsonPartyId === ""
  ) {
    throw new Error(
      "Production invitation synchronization could not determine the party for a submission record.",
    );
  }

  if (
    keyPartyId !== "" &&
    jsonPartyId !== "" &&
    keyPartyId !== jsonPartyId
  ) {
    throw new Error(
      "Production invitation synchronization found inconsistent submission-record party identifiers.",
    );
  }

  return (
    jsonPartyId ||
    keyPartyId
  );
}

function collectOperationalPartyIds(
  snapshot,
) {
  const partyIds = new Set();

  for (
    const section of
    GOOGLE_SHEETS_STORE_SECTIONS
  ) {
    if (
      section ===
      GOOGLE_SHEETS_STORE_SCHEMA
        .invitations
    ) {
      continue;
    }

    const rows =
      (
        snapshot.sections[
          section.title
        ] || []
      )
        .slice(1)
        .filter(rowHasData);

    for (const row of rows) {
      const partyId =
        section ===
        GOOGLE_SHEETS_STORE_SCHEMA
          .submissionRecords
          ? submissionRecordPartyId(
              row,
            )
          : directOperationalPartyId(
              row,
              section.title,
            );

      partyIds.add(partyId);
    }
  }

  return partyIds;
}

function assertOperationalInvitationCompatibility(
  snapshot,
  expectedInvitations,
) {
  const expected =
    validateExpectedProductionInvitations(
      expectedInvitations,
    );

  const stored =
    readStoredInvitationIndexes(
      snapshot,
    );

  const referencedPartyIds =
    collectOperationalPartyIds(
      snapshot,
    );

  for (
    const partyId of
    referencedPartyIds
  ) {
    const existingRecord =
      stored.byPartyId.get(
        partyId,
      );

    if (!existingRecord) {
      throw new Error(
        "Production invitation synchronization found operational RSVP data without its existing invitation configuration.",
      );
    }

    const expectedInvitation =
      expected.byPartyId.get(
        partyId,
      );

    if (!expectedInvitation) {
      throw new Error(
        "Production invitation synchronization would remove an invitation referenced by operational RSVP data.",
      );
    }

    if (
      existingRecord.inviteCode !==
        expectedInvitation.inviteCode ||
      !sameJson(
        existingRecord.configuration,
        expectedInvitation,
      )
    ) {
      throw new Error(
        "Production invitation synchronization would change an invitation referenced by operational RSVP data.",
      );
    }
  }

  let newInvitationCount = 0;
  let changedUnreferencedInvitationCount =
    0;
  let removedUnreferencedInvitationCount =
    0;

  for (
    const [
      inviteCode,
      expectedInvitation,
    ] of expected.byCode.entries()
  ) {
    const existingRecord =
      stored.byCode.get(
        inviteCode,
      );

    if (!existingRecord) {
      newInvitationCount += 1;
      continue;
    }

    if (
      !referencedPartyIds.has(
        existingRecord.partyId,
      ) &&
      !sameJson(
        existingRecord.configuration,
        expectedInvitation,
      )
    ) {
      changedUnreferencedInvitationCount +=
        1;
    }
  }

  for (
    const existingRecord of
    stored.byCode.values()
  ) {
    if (
      !expected.byCode.has(
        existingRecord.inviteCode,
      ) &&
      !referencedPartyIds.has(
        existingRecord.partyId,
      )
    ) {
      removedUnreferencedInvitationCount +=
        1;
    }
  }

  return Object.freeze({
    referencedPartyCount:
      referencedPartyIds.size,

    preservedReferencedInvitationCount:
      referencedPartyIds.size,

    existingInvitationCount:
      stored.byCode.size,

    expectedInvitationCount:
      expected.byCode.size,

    newInvitationCount,

    changedUnreferencedInvitationCount,

    removedUnreferencedInvitationCount,
  });
}

function assertProductionInvitationsMatchExpected(
  snapshot,
  expectedInvitations,
) {
  const expected =
    validateExpectedProductionInvitations(
      expectedInvitations,
    );

  const rows =
    invitationRows(
      snapshot,
    );

  if (
    rows.length !==
    expectedInvitations.length
  ) {
    throw new Error(
      "Production invitation verification found an unexpected record count.",
    );
  }

  const seen = new Set();

  for (const row of rows) {
    const [
      inviteCode,
      partyId,
      configurationJson,
    ] = row;

    if (
      typeof inviteCode !==
        "string" ||
      seen.has(inviteCode)
    ) {
      throw new Error(
        "Production invitation verification found duplicate or invalid invitation rows.",
      );
    }

    seen.add(inviteCode);

    const expectedInvitation =
      expected.byCode.get(
        inviteCode,
      );

    if (!expectedInvitation) {
      throw new Error(
        "Production invitation verification found an unexpected invitation row.",
      );
    }

    let actual;

    try {
      actual =
        JSON.parse(
          configurationJson,
        );
    } catch {
      throw new Error(
        "Production invitation verification found invalid private configuration JSON.",
      );
    }

    if (
      partyId !==
        expectedInvitation.partyId ||
      actual.environment !==
        "production" ||
      !sameJson(
        actual,
        expectedInvitation,
      )
    ) {
      throw new Error(
        "Production invitation verification found a configuration mismatch.",
      );
    }
  }

  return Object.freeze({
    invitationCount:
      rows.length,
  });
}

function safeTimestamp(date) {
  return date
    .toISOString()
    .replace(
      /[:.]/g,
      "-",
    );
}

async function writePrivateSnapshotFile({
  snapshot,
  backupDirectory,
  now = () => new Date(),
} = {}) {
  if (!snapshot) {
    throw new Error(
      "Production RSVP backup requires a snapshot.",
    );
  }

  if (
    typeof backupDirectory !==
      "string" ||
    backupDirectory.trim() ===
      ""
  ) {
    throw new Error(
      "Production RSVP backup requires a private backup directory.",
    );
  }

  const directory =
    path.resolve(
      backupDirectory,
    );

  await fs.mkdir(
    directory,
    {
      recursive: true,
    },
  );

  const filename =
    `rsvp-store-pre-production-load-${safeTimestamp(
      now(),
    )}.json`;

  const filepath =
    path.join(
      directory,
      filename,
    );

  await fs.writeFile(
    filepath,
    `${JSON.stringify(
      snapshot,
      null,
      2,
    )}\n`,
    {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx",
    },
  );

  return filepath;
}

async function restoreInvitationsFromSnapshot({
  sheets,
  spreadsheetId,
  snapshot,
} = {}) {
  if (
    !sheets ||
    !sheets.spreadsheets ||
    !sheets.spreadsheets.values ||
    typeof sheets.spreadsheets.values.clear !==
      "function" ||
    typeof sheets.spreadsheets.values.update !==
      "function"
  ) {
    throw new Error(
      "Production invitation restoration requires a valid Sheets client.",
    );
  }

  const section =
    GOOGLE_SHEETS_STORE_SCHEMA
      .invitations;

  const rows =
    snapshot &&
    snapshot.sections
      ? snapshot.sections[
          section.title
        ] || []
      : [];

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range:
      `${quoteSheetTitle(
        section.title,
      )}!A2:Z`,
    requestBody: {},
  });

  const dataRows =
    rows
      .slice(1)
      .filter(rowHasData)
      .map(
        (row) =>
          row.slice(
            0,
            section.headers.length,
          ),
      );

  if (
    dataRows.length === 0
  ) {
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range:
      `${quoteSheetTitle(
        section.title,
      )}!A2:C${dataRows.length + 1}`,
    valueInputOption: "RAW",
    requestBody: {
      values: dataRows,
    },
  });
}

module.exports = {
  SNAPSHOT_VERSION,
  assertOperationalInvitationCompatibility,
  assertOperationalSectionsEmpty,
  assertOperationalSectionsUnchanged,
  assertProductionInvitationsMatchExpected,
  collectOperationalPartyIds,
  readGoogleSheetsStoreSnapshot,
  restoreInvitationsFromSnapshot,
  writePrivateSnapshotFile,
};