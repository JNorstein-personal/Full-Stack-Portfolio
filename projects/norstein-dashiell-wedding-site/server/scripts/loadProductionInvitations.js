require("dotenv").config();

const path = require("node:path");

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

const {
  assertOperationalInvitationCompatibility,
  assertOperationalSectionsUnchanged,
  assertProductionInvitationsMatchExpected,
  readGoogleSheetsStoreSnapshot,
  restoreInvitationsFromSnapshot,
  writePrivateSnapshotFile,
} = require(
  "../src/services/storage/productionActivation"
);

const ACTIVATION_ACK =
  "WRITE_PRODUCTION_INVITATIONS";

function defaultBackupDirectory() {
  return path.resolve(
    __dirname,
    "..",
    "..",
    "private-working-materials",
    "rsvp-backups",
  );
}

function formatLoadSummary({
  transformed,
  compatibility,
  verification,
}) {
  const summary =
    transformed.summary;

  return [
    `${verification.invitationCount} functional production invitations`,
    `${summary.guestListInvitationCount} guest-list eligible`,
    `${summary.testInvitationCount} permanent test`,
    `${summary.reservedPlaceholderCount} reserved source codes`,
    `${summary.combinedMaximumAttendance} current guest-list maximum attendance`,
    `${compatibility.referencedPartyCount} operationally referenced invitations preserved`,
    `${compatibility.newInvitationCount} new invitation configurations`,
    `${compatibility.changedUnreferencedInvitationCount} corrected unreferenced invitation configurations`,
    `${compatibility.removedUnreferencedInvitationCount} removed unreferenced invitation configurations`,
    "pre-load private snapshot created",
  ].join("; ");
}

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
    spreadsheetId.trim() ===
      ""
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

  await connection.verifyAccess();

  const sheets =
    connection.getSheetsClient();

  await verifyGoogleSheetsStoreSchema({
    sheets,
    spreadsheetId,
  });

  const before =
    await readGoogleSheetsStoreSnapshot({
      sheets,
      spreadsheetId,
    });

  /*
   * Production invitation synchronization is allowed after RSVP activity
   * begins, but only when every invitation already referenced by operational
   * RSVP data remains exactly compatible with its stored configuration.
   *
   * This check occurs before the private backup and before any invitation
   * write. Newly assigned invitations may therefore be added later from the
   * reserved source-code range without requiring operational RSVP tables to
   * be empty.
   */
  const compatibility =
    assertOperationalInvitationCompatibility(
      before,
      transformed.configurations,
    );

  const backupDirectory =
    process.env
      .RSVP_PRODUCTION_BACKUP_DIR ||
    defaultBackupDirectory();

  await writePrivateSnapshotFile({
    snapshot: before,
    backupDirectory,
  });

  try {
    await replaceInvitationConfigurations({
      sheets,
      spreadsheetId,
      invitations:
        transformed.configurations,
      expectedEnvironment:
        "production",
    });

    const after =
      await readGoogleSheetsStoreSnapshot({
        sheets,
        spreadsheetId,
      });

    assertOperationalSectionsUnchanged(
      before,
      after,
    );

    const verification =
      assertProductionInvitationsMatchExpected(
        after,
        transformed.configurations,
      );

    console.log(
      `Production invitation configuration load: PASS (${formatLoadSummary({
        transformed,
        compatibility,
        verification,
      })})`,
    );
  } catch {
    try {
      await restoreInvitationsFromSnapshot({
        sheets,
        spreadsheetId,
        snapshot: before,
      });
    } catch {
      // Preserve the original activation failure.
      // The private pre-load snapshot remains available for recovery.
    }

    throw new Error(
      "Production invitation configuration load failed after backup creation.",
    );
  }
}

main().catch(() => {
  console.error(
    "Production invitation configuration load: FAIL",
  );
  process.exitCode = 1;
});