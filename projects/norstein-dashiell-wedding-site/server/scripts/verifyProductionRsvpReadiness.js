require("dotenv").config();

const {
  PRODUCTION_AUDIT_TARGETS,
  assertProductionAuditTargets,
  transformProductionInvitationRows,
} = require(
  "../src/rsvp/productionInvitationTransform"
);
const {
  loadProductionSourceFile,
} = require(
  "../src/rsvp/productionSourceFile"
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
  assertOperationalSectionsEmpty,
  readGoogleSheetsStoreSnapshot,
} = require(
  "../src/services/storage/productionActivation"
);

async function main() {
  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    throw new Error(
      "Production RSVP readiness verification requires NODE_ENV=production.",
    );
  }

  const rows =
    loadProductionSourceFile(
      process.env
        .RSVP_PRODUCTION_SOURCE_FILE,
    );
  const transformed =
    transformProductionInvitationRows(
      rows,
    );

  assertProductionAuditTargets(
    transformed.summary,
    PRODUCTION_AUDIT_TARGETS,
  );

  const connection =
    createGoogleSheetsConnection({
      spreadsheetId:
        process.env
          .GOOGLE_SPREADSHEET_ID,
    });

  await connection.verifyAccess();

  const sheets =
    connection.getSheetsClient();
  const spreadsheetId =
    connection.getSpreadsheetId();

  await verifyGoogleSheetsStoreSchema({
    sheets,
    spreadsheetId,
  });

  const snapshot =
    await readGoogleSheetsStoreSnapshot({
      sheets,
      spreadsheetId,
    });

  assertOperationalSectionsEmpty(
    snapshot,
  );

  console.log(
    `Production RSVP workbook readiness: PASS (schema valid; source audit ${transformed.summary.activeInvitationCount} records; operational RSVP tables empty)`,
  );
}

main().catch(() => {
  console.error(
    "Production RSVP workbook readiness: FAIL",
  );
  process.exitCode = 1;
});
