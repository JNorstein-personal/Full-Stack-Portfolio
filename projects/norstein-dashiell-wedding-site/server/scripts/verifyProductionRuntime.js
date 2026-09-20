require("dotenv").config();

const {
  loadEnvironment,
} = require(
  "../src/config/env"
);
const {
  createConfiguredEmailTransport,
} = require(
  "../src/services/resendEmailTransport"
);
const {
  createGoogleSheetsConnection,
} = require(
  "../src/services/storage/googleSheetsConnection"
);
const {
  verifyGoogleSheetsStoreSchema,
} = require(
  "../src/services/storage/googleSheetsStoreSetup"
);
const {
  acquireProductionWriterLock,
  assertProductionRuntimeEnvironment,
} = require(
  "../src/services/productionRuntime"
);

async function main() {
  const environment =
    loadEnvironment();

  assertProductionRuntimeEnvironment(
    environment,
  );

  const connection =
    createGoogleSheetsConnection({
      spreadsheetId:
        environment
          .GOOGLE_SPREADSHEET_ID,
    });

  await connection.verifyAccess();

  await verifyGoogleSheetsStoreSchema({
    sheets:
      connection
        .getSheetsClient(),
    spreadsheetId:
      connection
        .getSpreadsheetId(),
  });

  createConfiguredEmailTransport({
    environment,
  });

  const writerLock =
    await acquireProductionWriterLock({
      lockFile:
        environment
          .RSVP_SINGLE_WRITER_LOCK_FILE,
    });

  await writerLock.release();

  console.log(
    "Production RSVP runtime readiness: PASS",
  );
}

main().catch(() => {
  console.error(
    "Production RSVP runtime readiness: FAIL",
  );
  process.exitCode = 1;
});
