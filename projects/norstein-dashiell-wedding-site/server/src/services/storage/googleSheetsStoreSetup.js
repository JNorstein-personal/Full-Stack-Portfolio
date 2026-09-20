const {
  GOOGLE_SHEETS_STORE_SECTIONS,
  GOOGLE_SHEETS_STORE_SCHEMA,
} = require("./googleSheetsStoreSchema");

function validateSetupClient(
  sheets,
) {
  if (
    !sheets ||
    !sheets.spreadsheets ||
    typeof sheets.spreadsheets
      .get !== "function" ||
    typeof sheets.spreadsheets
      .batchUpdate !== "function" ||
    !sheets.spreadsheets.values ||
    typeof sheets.spreadsheets.values
      .get !== "function" ||
    typeof sheets.spreadsheets.values
      .update !== "function" ||
    typeof sheets.spreadsheets.values
      .clear !== "function"
  ) {
    throw new Error(
      "Google Sheets RSVP store setup requires a valid Sheets client.",
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
      "Google Sheets RSVP store setup requires a spreadsheet identifier.",
    );
  }

  return spreadsheetId;
}

async function ensureStoreSheets({
  sheets,
  spreadsheetId,
}) {
  const metadata =
    await sheets.spreadsheets.get({
      spreadsheetId,
      fields:
        "sheets.properties.title",
    });

  const existingTitles =
    new Set(
      (
        metadata.data.sheets || []
      ).map(
        (sheet) =>
          sheet.properties.title,
      ),
    );

  const missing =
    GOOGLE_SHEETS_STORE_SECTIONS
      .filter(
        (section) =>
          !existingTitles.has(
            section.title,
          ),
      );

  if (missing.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests:
          missing.map(
            (section) => ({
              addSheet: {
                properties: {
                  title:
                    section.title,
                },
              },
            }),
          ),
      },
    });
  }

  return missing.map(
    (section) =>
      section.title,
  );
}

async function writeHeaders({
  sheets,
  spreadsheetId,
}) {
  for (
    const section of
    GOOGLE_SHEETS_STORE_SECTIONS
  ) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range:
        `'${section.title}'!A1:${String.fromCharCode(
          64 +
            section.headers.length,
        )}1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [...section.headers],
        ],
      },
    });
  }
}

async function replaceInvitationConfigurations({
  sheets,
  spreadsheetId,
  invitations,
  expectedEnvironment,
}) {
  if (!Array.isArray(invitations)) {
    throw new Error(
      "Invitation configuration replacement requires an array.",
    );
  }

  if (
    expectedEnvironment !==
      "development" &&
    expectedEnvironment !==
      "production"
  ) {
    throw new Error(
      "Invitation configuration replacement requires an explicit environment.",
    );
  }

  for (
    let index = 0;
    index < invitations.length;
    index += 1
  ) {
    const invitation =
      invitations[index];

    if (
      !invitation ||
      invitation.environment !==
        expectedEnvironment ||
      typeof invitation.inviteCode !==
        "string" ||
      typeof invitation.partyId !==
        "string"
    ) {
      throw new Error(
        `Invitation configuration ${index} is not eligible for the requested environment.`,
      );
    }
  }

  const section =
    GOOGLE_SHEETS_STORE_SCHEMA
      .invitations;

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range:
      `'${section.title}'!A2:Z`,
    requestBody: {},
  });

  if (invitations.length === 0) {
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range:
      `'${section.title}'!A2:C${invitations.length + 1}`,
    valueInputOption: "RAW",
    requestBody: {
      values:
        invitations.map(
          (invitation) => [
            invitation.inviteCode,
            invitation.partyId,
            JSON.stringify(
              invitation,
            ),
          ],
        ),
    },
  });
}

async function seedDevelopmentInvitations({
  sheets,
  spreadsheetId,
  invitations,
}) {
  return replaceInvitationConfigurations({
    sheets,
    spreadsheetId,
    invitations,
    expectedEnvironment:
      "development",
  });
}

async function initializeDevelopmentGoogleSheetsStore({
  sheets,
  spreadsheetId,
  invitations,
}) {
  validateSetupClient(sheets);
  requireSpreadsheetId(
    spreadsheetId,
  );

  const createdSheets =
    await ensureStoreSheets({
      sheets,
      spreadsheetId,
    });

  await writeHeaders({
    sheets,
    spreadsheetId,
  });

  await seedDevelopmentInvitations({
    sheets,
    spreadsheetId,
    invitations,
  });

  return Object.freeze({
    createdSheets:
      Object.freeze(
        createdSheets,
      ),
    invitationCount:
      invitations.length,
  });
}

async function verifyGoogleSheetsStoreSchema({
  sheets,
  spreadsheetId,
}) {
  validateSetupClient(sheets);
  requireSpreadsheetId(
    spreadsheetId,
  );

  for (
    const section of
    GOOGLE_SHEETS_STORE_SECTIONS
  ) {
    const response =
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range:
          `'${section.title}'!A1:${String.fromCharCode(
            64 +
              section.headers.length,
          )}1`,
      });

    const actual =
      response.data.values &&
      response.data.values[0]
        ? response.data.values[0]
        : [];

    if (
      actual.length !==
        section.headers.length ||
      section.headers.some(
        (header, index) =>
          actual[index] !== header,
      )
    ) {
      throw new Error(
        "Google Sheets RSVP store schema verification failed.",
      );
    }
  }

  return true;
}

module.exports = {
  initializeDevelopmentGoogleSheetsStore,
  replaceInvitationConfigurations,
  verifyGoogleSheetsStoreSchema,
};
