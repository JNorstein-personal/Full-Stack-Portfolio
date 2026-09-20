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
  replaceInvitationConfigurations,
  verifyGoogleSheetsStoreSchema,
} = require(
  "../src/services/storage/googleSheetsStoreSetup"
);

const ACTIVATION_ACK =
  "WRITE_PRODUCTION_INVITATIONS";

async function main() {
  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    throw new Error(
      "Production invitation loading requires NODE_ENV=production.",
    );
  }

  if (
    process.env
      .RSVP_PRODUCTION_ACTIVATION_ACK !==
    ACTIVATION_ACK
  ) {
    throw new Error(
      "Production invitation loading requires explicit activation acknowledgement.",
    );
  }

  const spreadsheetId =
    process.env
      .GOOGLE_SPREADSHEET_ID;

  if (
    typeof spreadsheetId !==
      "string" ||
    spreadsheetId.trim() === ""
  ) {
    throw new Error(
      "Production invitation loading requires GOOGLE_SPREADSHEET_ID.",
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
      spreadsheetId,
    });

  const sheets =
    connection.getSheetsClient();

  await verifyGoogleSheetsStoreSchema({
    sheets,
    spreadsheetId,
  });

  await replaceInvitationConfigurations({
    sheets,
    spreadsheetId,
    invitations:
      transformed.configurations,
    expectedEnvironment:
      "production",
  });

  console.log(
    `Production invitation configuration load: PASS (${transformed.summary.activeInvitationCount} records)`,
  );
}

main().catch(() => {
  console.error(
    "Production invitation configuration load: FAIL",
  );
  process.exitCode = 1;
});
