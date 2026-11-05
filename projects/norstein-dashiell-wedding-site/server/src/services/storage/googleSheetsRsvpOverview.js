const {
  GOOGLE_SHEETS_STORE_SCHEMA,
} = require("./googleSheetsStoreSchema");

const RSVP_OVERVIEW_SHEET_TITLE =
  "Wedding RSVP Overview";
const RSVP_OVERVIEW_PARTY_START_ROW =
  15;
const RSVP_OVERVIEW_PARTY_ROW_COUNT =
  64;
const RSVP_OVERVIEW_PARTY_END_ROW =
  RSVP_OVERVIEW_PARTY_START_ROW +
  RSVP_OVERVIEW_PARTY_ROW_COUNT - 1;
const RSVP_OVERVIEW_ATTENDEE_START_ROW =
  85;
const RSVP_OVERVIEW_ATTENDEE_CLEAR_END_ROW =
  1000;

const RSVP_OVERVIEW_PARTY_HEADERS =
  Object.freeze([
    "Scope",
    "Party",
    "Invite Code",
    "Max Guests",
    "RSVP Status",
    "Ceremony",
    "Reception",
    "Guests Attending",
    "Adults 21+",
    "Ages 18–20",
    "Ages 3–17",
    "Under 3",
    "Attending Guests",
    "Dietary / Accessibility Notes",
    "Last Updated (ET)",
    "Version",
    "Confirmation",
    "Party ID",
  ]);

const RSVP_OVERVIEW_ATTENDEE_HEADERS =
  Object.freeze([
    "Party",
    "Guest",
    "Dietary / Accessibility Information",
    "RSVP Version",
    "Last Updated (ET)",
    "Scope",
  ]);

function quoteSheetTitle(title) {
  return `'${String(title).replace(
    /'/g,
    "''",
  )}'`;
}

function parseJsonCell(
  value,
  context,
) {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    throw new Error(
      `RSVP Overview synchronization found missing JSON in ${context}.`,
    );
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new Error(
      `RSVP Overview synchronization found invalid JSON in ${context}.`,
    );
  }
}

function validateSheetsClient(sheets) {
  if (
    !sheets ||
    !sheets.spreadsheets ||
    !sheets.spreadsheets.values ||
    typeof sheets.spreadsheets.values
      .get !== "function" ||
    typeof sheets.spreadsheets.values
      .update !== "function" ||
    typeof sheets.spreadsheets.values
      .clear !== "function"
  ) {
    throw new Error(
      "RSVP Overview synchronization requires a valid Sheets values client.",
    );
  }
}

function requireSpreadsheetId(
  spreadsheetId,
) {
  if (
    typeof spreadsheetId !==
      "string" ||
    spreadsheetId.trim() === ""
  ) {
    throw new Error(
      "RSVP Overview synchronization requires a spreadsheet identifier.",
    );
  }
}

function sameRow(
  actual,
  expected,
) {
  return (
    Array.isArray(actual) &&
    actual.length ===
      expected.length &&
    expected.every(
      (value, index) =>
        actual[index] === value,
    )
  );
}

async function verifyRsvpOverviewLayout({
  sheets,
  spreadsheetId,
}) {
  const [
    partyHeaderResponse,
    attendeeHeaderResponse,
  ] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range:
        `${quoteSheetTitle(
          RSVP_OVERVIEW_SHEET_TITLE,
        )}!A14:R14`,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range:
        `${quoteSheetTitle(
          RSVP_OVERVIEW_SHEET_TITLE,
        )}!A84:F84`,
    }),
  ]);

  const partyHeaders =
    partyHeaderResponse &&
    partyHeaderResponse.data &&
    Array.isArray(
      partyHeaderResponse.data.values,
    ) &&
    partyHeaderResponse.data.values[0]
      ? partyHeaderResponse.data.values[0]
      : [];

  const attendeeHeaders =
    attendeeHeaderResponse &&
    attendeeHeaderResponse.data &&
    Array.isArray(
      attendeeHeaderResponse.data.values,
    ) &&
    attendeeHeaderResponse.data.values[0]
      ? attendeeHeaderResponse.data.values[0]
      : [];

  if (
    !sameRow(
      partyHeaders,
      RSVP_OVERVIEW_PARTY_HEADERS,
    ) ||
    !sameRow(
      attendeeHeaders,
      RSVP_OVERVIEW_ATTENDEE_HEADERS,
    )
  ) {
    throw new Error(
      "RSVP Overview synchronization found an unexpected worksheet layout.",
    );
  }

  return true;
}

function scopeForInvitation(
  invitation,
) {
  return (
    invitation &&
    invitation.guestListEligible ===
      true &&
    invitation.recordRole !== "test"
  )
    ? "Production"
    : "Test (excluded)";
}

function toNewYorkSheetsSerial(
  recordedAt,
) {
  if (
    typeof recordedAt !== "string" ||
    recordedAt.trim() === ""
  ) {
    return "";
  }

  const date = new Date(recordedAt);

  if (
    Number.isNaN(date.getTime())
  ) {
    throw new Error(
      "RSVP Overview synchronization found an invalid recordedAt timestamp.",
    );
  }

  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      },
    );

  const parts =
    Object.fromEntries(
      formatter
        .formatToParts(date)
        .filter(
          (part) =>
            part.type !==
            "literal",
        )
        .map(
          (part) => [
            part.type,
            Number(part.value),
          ],
        ),
    );

  const localClockAsUtc =
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      date.getUTCMilliseconds(),
    );

  return (
    localClockAsUtc /
      86400000 +
    25569
  );
}

function invitationDisplayCode(
  invitation,
) {
  return (
    invitation.inviteCodeDisplay ||
    invitation.inviteCode ||
    ""
  );
}

function buildDietarySummary(
  attendeeDetails,
) {
  return attendeeDetails
    .filter(
      (attendee) =>
        attendee &&
        typeof attendee
          .dietaryPreferences ===
          "string" &&
        attendee
          .dietaryPreferences
          .trim() !== "",
    )
    .map(
      (attendee) =>
        `${attendee.attendeeName}: ${attendee.dietaryPreferences}`,
    )
    .join("\n");
}

function normalizeCurrentRsvp(
  current,
  partyId,
) {
  if (!current) {
    return null;
  }

  if (
    !Number.isInteger(
      current.version,
    ) ||
    current.version < 1 ||
    !Array.isArray(
      current.eventAttendance,
    ) ||
    !Number.isInteger(
      current.overallAttendance,
    ) ||
    current.overallAttendance < 0 ||
    !current.attendanceTotals ||
    !Array.isArray(
      current.attendeeDetails,
    )
  ) {
    throw new Error(
      `RSVP Overview synchronization found invalid current RSVP state for ${partyId}.`,
    );
  }

  return current;
}

function buildPartyRow({
  invitation,
  current,
}) {
  const scope =
    scopeForInvitation(
      invitation,
    );

  if (!current) {
    return [
      scope,
      invitation.partyDisplayName ||
        "",
      invitationDisplayCode(
        invitation,
      ),
      invitation.maximumAttendance ??
        "",
      "No Response",
      "",
      "",
      0,
      0,
      0,
      0,
      0,
      "",
      "",
      "",
      "",
      "",
      invitation.partyId,
    ];
  }

  const attendeeDetails =
    current.attendeeDetails;
  const attendanceTotals =
    current.attendanceTotals;

  return [
    scope,
    invitation.partyDisplayName ||
      "",
    invitationDisplayCode(
      invitation,
    ),
    invitation.maximumAttendance ??
      "",
    current.overallAttendance > 0
      ? "Attending"
      : "Declined",
    current.eventAttendance.includes(
      "ceremony",
    )
      ? "Yes"
      : "No",
    current.eventAttendance.includes(
      "reception",
    )
      ? "Yes"
      : "No",
    current.overallAttendance,
    attendanceTotals.adults21Plus ??
      0,
    attendanceTotals.youngAdults18To20 ??
      0,
    attendanceTotals.children3To17 ??
      0,
    attendanceTotals.childrenUnder3 ??
      0,
    attendeeDetails
      .map(
        (attendee) =>
          attendee.attendeeName,
      )
      .filter(Boolean)
      .join("; "),
    buildDietarySummary(
      attendeeDetails,
    ),
    toNewYorkSheetsSerial(
      current.recordedAt,
    ),
    current.version,
    current.confirmation &&
    current.confirmation.method
      ? current.confirmation.method
      : "",
    invitation.partyId,
  ];
}

function buildAttendeeRows({
  invitations,
  currentByPartyId,
}) {
  const rows = [];

  for (
    const invitation of invitations
  ) {
    const current =
      currentByPartyId.get(
        invitation.partyId,
      );

    if (!current) {
      continue;
    }

    const scope =
      scopeForInvitation(
        invitation,
      );
    const lastUpdated =
      toNewYorkSheetsSerial(
        current.recordedAt,
      );

    for (
      const attendee of
      current.attendeeDetails
    ) {
      rows.push([
        invitation.partyDisplayName ||
          "",
        attendee.attendeeName ||
          "",
        attendee.dietaryPreferences ||
          "",
        current.version,
        lastUpdated,
        scope,
      ]);
    }
  }

  return rows;
}

function buildRsvpOverviewData({
  invitationRows,
  currentRsvpRows,
}) {
  const invitations = [];
  const invitationByPartyId =
    new Map();

  for (
    const row of invitationRows
  ) {
    if (!row || !row[2]) {
      continue;
    }

    const invitation =
      parseJsonCell(
        row[2],
        "Invitations",
      );

    if (
      !invitation ||
      typeof invitation.partyId !==
        "string" ||
      invitation.partyId === "" ||
      invitationByPartyId.has(
        invitation.partyId,
      )
    ) {
      throw new Error(
        "RSVP Overview synchronization found invalid or duplicate invitation data.",
      );
    }

    invitations.push(
      invitation,
    );
    invitationByPartyId.set(
      invitation.partyId,
      invitation,
    );
  }

  if (
    invitations.length >
    RSVP_OVERVIEW_PARTY_ROW_COUNT
  ) {
    throw new Error(
      "RSVP Overview synchronization found more invitations than the presentation layout supports.",
    );
  }

  const currentByPartyId =
    new Map();

  for (
    const row of currentRsvpRows
  ) {
    if (!row || !row[2]) {
      continue;
    }

    const partyId = row[0];

    if (
      typeof partyId !==
        "string" ||
      !invitationByPartyId.has(
        partyId,
      ) ||
      currentByPartyId.has(
        partyId,
      )
    ) {
      throw new Error(
        "RSVP Overview synchronization found current RSVP data that does not map uniquely to an invitation.",
      );
    }

    const current =
      normalizeCurrentRsvp(
        parseJsonCell(
          row[2],
          "Current RSVPs",
        ),
        partyId,
      );

    currentByPartyId.set(
      partyId,
      current,
    );
  }

  const partyRows =
    invitations.map(
      (invitation) =>
        buildPartyRow({
          invitation,
          current:
            currentByPartyId.get(
              invitation.partyId,
            ) || null,
        }),
    );

  while (
    partyRows.length <
    RSVP_OVERVIEW_PARTY_ROW_COUNT
  ) {
    partyRows.push(
      Array(
        RSVP_OVERVIEW_PARTY_HEADERS
          .length,
      ).fill(""),
    );
  }

  const attendeeRows =
    buildAttendeeRows({
      invitations,
      currentByPartyId,
    });

  return Object.freeze({
    partyRows,
    attendeeRows,
    invitationCount:
      invitations.length,
    responseCount:
      currentByPartyId.size,
    attendeeCount:
      attendeeRows.length,
  });
}

async function readCanonicalRows({
  sheets,
  spreadsheetId,
}) {
  const [
    invitationResponse,
    currentResponse,
  ] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range:
        `${quoteSheetTitle(
          GOOGLE_SHEETS_STORE_SCHEMA
            .invitations.title,
        )}!A2:C`,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range:
        `${quoteSheetTitle(
          GOOGLE_SHEETS_STORE_SCHEMA
            .currentRsvps.title,
        )}!A2:C`,
    }),
  ]);

  return {
    invitationRows:
      invitationResponse &&
      invitationResponse.data &&
      Array.isArray(
        invitationResponse.data.values,
      )
        ? invitationResponse.data.values
        : [],
    currentRsvpRows:
      currentResponse &&
      currentResponse.data &&
      Array.isArray(
        currentResponse.data.values,
      )
        ? currentResponse.data.values
        : [],
  };
}

async function rebuildRsvpOverview({
  sheets,
  spreadsheetId,
}) {
  validateSheetsClient(sheets);
  requireSpreadsheetId(
    spreadsheetId,
  );

  await verifyRsvpOverviewLayout({
    sheets,
    spreadsheetId,
  });

  const sourceRows =
    await readCanonicalRows({
      sheets,
      spreadsheetId,
    });
  const overview =
    buildRsvpOverviewData(
      sourceRows,
    );

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range:
      `${quoteSheetTitle(
        RSVP_OVERVIEW_SHEET_TITLE,
      )}!A${RSVP_OVERVIEW_PARTY_START_ROW}:R${RSVP_OVERVIEW_PARTY_END_ROW}`,
    valueInputOption: "RAW",
    requestBody: {
      values:
        overview.partyRows,
    },
  });

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range:
      `${quoteSheetTitle(
        RSVP_OVERVIEW_SHEET_TITLE,
      )}!A${RSVP_OVERVIEW_ATTENDEE_START_ROW}:F${RSVP_OVERVIEW_ATTENDEE_CLEAR_END_ROW}`,
    requestBody: {},
  });

  if (
    overview.attendeeRows.length > 0
  ) {
    const attendeeEndRow =
      RSVP_OVERVIEW_ATTENDEE_START_ROW +
      overview.attendeeRows.length -
      1;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range:
        `${quoteSheetTitle(
          RSVP_OVERVIEW_SHEET_TITLE,
        )}!A${RSVP_OVERVIEW_ATTENDEE_START_ROW}:F${attendeeEndRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values:
          overview.attendeeRows,
      },
    });
  }

  return Object.freeze({
    invitationCount:
      overview.invitationCount,
    responseCount:
      overview.responseCount,
    attendeeCount:
      overview.attendeeCount,
  });
}

function createRsvpOverviewSynchronizer({
  sheets,
  spreadsheetId,
} = {}) {
  validateSheetsClient(sheets);
  requireSpreadsheetId(
    spreadsheetId,
  );

  let synchronizationTail =
    Promise.resolve();

  return Object.freeze({
    synchronize() {
      const run =
        synchronizationTail
          .catch(() => {})
          .then(() =>
            rebuildRsvpOverview({
              sheets,
              spreadsheetId,
            }),
          );

      synchronizationTail =
        run.catch(() => {});

      return run;
    },
  });
}

module.exports = {
  RSVP_OVERVIEW_ATTENDEE_HEADERS,
  RSVP_OVERVIEW_PARTY_HEADERS,
  RSVP_OVERVIEW_PARTY_ROW_COUNT,
  RSVP_OVERVIEW_SHEET_TITLE,
  buildRsvpOverviewData,
  createRsvpOverviewSynchronizer,
  rebuildRsvpOverview,
  toNewYorkSheetsSerial,
  verifyRsvpOverviewLayout,
};
