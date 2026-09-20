require("dotenv").config();

const {
  loadEnvironment,
} = require("../src/config/env");
const {
  loadDevelopmentInvitationFixtures,
} = require("../src/rsvp/developmentInvitations");
const {
  createGoogleSheetsConnection,
} = require(
  "../src/services/storage/googleSheetsConnection"
);
const {
  initializeDevelopmentGoogleSheetsStore,
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
      "Development Google Sheets store initialization is disabled in production mode.",
    );
  }

  if (
    !environment
      .GOOGLE_SPREADSHEET_ID
  ) {
    throw new Error(
      "Development Google Sheets store initialization requires GOOGLE_SPREADSHEET_ID.",
    );
  }

  const registry =
    loadDevelopmentInvitationFixtures({
      runtimeEnvironment:
        environment.NODE_ENV,
    });

  const connection =
    createGoogleSheetsConnection({
      spreadsheetId:
        environment
          .GOOGLE_SPREADSHEET_ID,
    });

  const result =
    await initializeDevelopmentGoogleSheetsStore({
      sheets:
        connection
          .getSheetsClient(),
      spreadsheetId:
        connection
          .getSpreadsheetId(),
      invitations:
        registry.fixtures,
    });

  console.log(
    `Google Sheets development RSVP store initialization: PASS (${result.invitationCount} fictional invitations)`,
  );
}

main().catch(() => {
  console.error(
    "Google Sheets development RSVP store initialization: FAIL",
  );
  process.exitCode = 1;
});
