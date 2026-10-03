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
  readGoogleSheetsStoreSnapshot,
} = require(
  "../src/services/storage/productionActivation"
);

function formatReadinessSummary({
  transformed,
  compatibility,
}) {
  const summary =
    transformed.summary;

  return [
    "schema valid",
    `${summary.numberedSourceRowCount} numbered source rows`,
    `${summary.functionalInvitationCount} functional production invitations`,
    `${summary.guestListInvitationCount} guest-list eligible`,
    `${summary.testInvitationCount} permanent test`,
    `${summary.reservedPlaceholderCount} reserved source codes`,
    `${summary.combinedMaximumAttendance} current guest-list maximum attendance`,
    `${summary.baselineCombinedMaximumAttendance} established invites 1-57 baseline capacity`,
    `${compatibility.referencedPartyCount} operationally referenced invitations preserved`,
    `${compatibility.newInvitationCount} new invitation configurations`,
    `${compatibility.changedUnreferencedInvitationCount} corrected unreferenced invitation configurations`,
    `${compatibility.removedUnreferencedInvitationCount} removable unreferenced invitation configurations`,
  ].join("; ");
}

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

  /*
   * Readiness no longer requires empty operational RSVP tables.
   *
   * Instead, the proposed source-derived invitation set must be compatible
   * with every invitation already referenced by operational RSVP history.
   * This permits future reserved invitations to become active without
   * invalidating existing responses, versions, submissions, deliveries, or
   * resends.
   */
  const compatibility =
    assertOperationalInvitationCompatibility(
      snapshot,
      transformed.configurations,
    );

  console.log(
    `Production RSVP workbook readiness: PASS (${formatReadinessSummary({
      transformed,
      compatibility,
    })})`,
  );
}

main().catch(() => {
  console.error(
    "Production RSVP workbook readiness: FAIL",
  );
  process.exitCode = 1;
});