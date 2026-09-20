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
  assertProductionInvitationsMatchExpected,
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
      "Production RSVP activation verification requires NODE_ENV=production.",
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

  const result =
    assertProductionInvitationsMatchExpected(
      snapshot,
      transformed.configurations,
    );

  console.log(
    `Production RSVP activation verification: PASS (${result.invitationCount} production invitations; operational RSVP tables empty)`,
  );
}

main().catch(() => {
  console.error(
    "Production RSVP activation verification: FAIL",
  );
  process.exitCode = 1;
});
