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

function assertProductionInvitationsMatchExpected(
  snapshot,
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

  const expectedByCode =
    new Map();

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
      typeof invitation.partyId !==
        "string" ||
      expectedByCode.has(
        invitation.inviteCode,
      )
    ) {
      throw new Error(
        "Production invitation verification received invalid expected configuration.",
      );
    }

    expectedByCode.set(
      invitation.inviteCode,
      invitation,
    );
  }

  const seen =
    new Set();

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

    const expected =
      expectedByCode.get(
        inviteCode,
      );

    if (!expected) {
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
        expected.partyId ||
      actual.environment !==
        "production" ||
      JSON.stringify(
        actual,
      ) !==
        JSON.stringify(
          expected,
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
  assertOperationalSectionsEmpty,
  assertOperationalSectionsUnchanged,
  assertProductionInvitationsMatchExpected,
  readGoogleSheetsStoreSnapshot,
  restoreInvitationsFromSnapshot,
  writePrivateSnapshotFile,
};
