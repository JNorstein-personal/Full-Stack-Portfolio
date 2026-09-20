require("dotenv").config();

const {
  loadEnvironment,
} = require(
  "../src/config/env"
);
const {
  createGoogleSheetsConnection,
} = require(
  "../src/services/storage/googleSheetsConnection"
);

async function main() {
  const environment =
    loadEnvironment();

  if (
    environment.NODE_ENV ===
    "production"
  ) {
    throw new Error(
      "Development Google Sheets verification is disabled in production mode.",
    );
  }

  if (
    !environment.GOOGLE_SPREADSHEET_ID
  ) {
    throw new Error(
      "Development Google Sheets verification requires GOOGLE_SPREADSHEET_ID.",
    );
  }

  const connection =
    createGoogleSheetsConnection({
      spreadsheetId:
        environment.GOOGLE_SPREADSHEET_ID,
    });

  await connection.verifyAccess();

  console.log(
    "Google Sheets development authentication: PASS",
  );
}

main().catch(() => {
  console.error(
    "Google Sheets development authentication: FAIL",
  );
  process.exitCode = 1;
});
