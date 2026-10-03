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
  assertOperationalInvitationCompatibility,
  assertProductionInvitationsMatchExpected,
  readGoogleSheetsStoreSnapshot,
} = require(
  "../src/services/storage/productionActivation"
);

function formatActivationSummary({
  transformed,
  compatibility,
  verification,
}) {
  const summary =
    transformed.summary;

  return [
    `${verification.invitationCount} functional production invitations verified`,
    `${summary.guestListInvitationCount} guest-list eligible`,
    `${summary.testInvitationCount} permanent test`,
    `${summary.reservedPlaceholderCount} reserved source codes`,
    `${summary.combinedMaximumAttendance} current guest-list maximum attendance`,
    `${summary.baselineCombinedMaximumAttendance} established invites 1-57 baseline capacity`,
    `${compatibility.referencedPartyCount} operationally referenced invitations preserved`,
  ].join("; ");
}

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

  /*
   * Post-load activation verification has two independent responsibilities:
   *
   * 1. The stored Invitations sheet must exactly match the current
   *    source-derived functional production configurations.
   * 2. Any operational RSVP history already present must still resolve to
   *    the same invitation configurations it references.
   *
   * Operational tables are intentionally allowed to contain data. Future
   * reserved invitation codes may be assigned after RSVP activity begins.
   */
  const verification =
    assertProductionInvitationsMatchExpected(
      snapshot,
      transformed.configurations,
    );

  const compatibility =
    assertOperationalInvitationCompatibility(
      snapshot,
      transformed.configurations,
    );

  console.log(
    `Production RSVP activation verification: PASS (${formatActivationSummary({
      transformed,
      compatibility,
      verification,
    })})`,
  );
}

main().catch(() => {
  console.error(
    "Production RSVP activation verification: FAIL",
  );
  process.exitCode = 1;
});