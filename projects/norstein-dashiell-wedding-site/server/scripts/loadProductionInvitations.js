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
  assertOperationalSectionsEmpty,
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

  assertOperationalSectionsEmpty(
    before,
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
      `Production invitation configuration load: PASS (${verification.invitationCount} records; pre-load private snapshot created)`,
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
