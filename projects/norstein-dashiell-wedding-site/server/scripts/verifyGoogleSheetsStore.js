require("dotenv").config();

const {
  loadEnvironment,
} = require("../src/config/env");
const {
  createGoogleSheetsConnection,
} = require(
  "../src/services/storage/googleSheetsConnection"
);
const {
  createGoogleSheetsStore,
} = require(
  "../src/services/storage/googleSheetsStore"
);
const {
  verifyGoogleSheetsStoreSchema,
} = require(
  "../src/services/storage/googleSheetsStoreSetup"
);

async function main() {
  const environment =
    loadEnvironment();

  if (
    environment.NODE_ENV ===
    "production"
  ) {
    throw new Error(
      "Development Google Sheets store verification is disabled in production mode.",
    );
  }

  if (
    !environment
      .GOOGLE_SPREADSHEET_ID
  ) {
    throw new Error(
      "Development Google Sheets store verification requires GOOGLE_SPREADSHEET_ID.",
    );
  }

  const connection =
    createGoogleSheetsConnection({
      spreadsheetId:
        environment
          .GOOGLE_SPREADSHEET_ID,
    });

  const sheets =
    connection.getSheetsClient();
  const spreadsheetId =
    connection.getSpreadsheetId();

  await verifyGoogleSheetsStoreSchema({
    sheets,
    spreadsheetId,
  });

  const store =
    createGoogleSheetsStore({
      sheets,
      spreadsheetId,
    });

  const invitation =
    await store
      .findInvitationByCanonicalCode(
        "DEV001",
      );

  if (
    !invitation ||
    invitation.environment !==
      "development" ||
    invitation.inviteCode !==
      "DEV001"
  ) {
    throw new Error(
      "Development Google Sheets RSVP store invitation verification failed.",
    );
  }

  console.log(
    "Google Sheets development RSVP store verification: PASS",
  );
}

main().catch(() => {
  console.error(
    "Google Sheets development RSVP store verification: FAIL",
  );
  process.exitCode = 1;
});
