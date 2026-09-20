const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const {
  loadDevelopmentInvitationFixtures,
} = require(
  "../src/rsvp/developmentInvitations"
);
const {
  initializeDevelopmentGoogleSheetsStore,
  replaceInvitationConfigurations,
} = require(
  "../src/services/storage/googleSheetsStoreSetup"
);
const {
  GOOGLE_SHEETS_STORE_SCHEMA,
} = require(
  "../src/services/storage/googleSheetsStoreSchema"
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
const {
  createFakeSheetsClient,
} = require(
  "./helpers/fakeGoogleSheets"
);

async function createInitializedFake() {
  const fake =
    createFakeSheetsClient();

  const registry =
    loadDevelopmentInvitationFixtures({
      runtimeEnvironment:
        "test",
    });

  await initializeDevelopmentGoogleSheetsStore({
    sheets:
      fake.sheets,
    spreadsheetId:
      "fictional-sheet",
    invitations:
      registry.fixtures,
  });

  return {
    fake,
    registry,
  };
}

function productionInvitation(
  inviteCode,
  partyId,
) {
  return {
    inviteCode,
    inviteCodeDisplay:
      `${inviteCode.slice(0, 3)}-${inviteCode.slice(3)}`,
    partyId,
    partyDisplayName:
      "Example Party",
    greeting:
      "Example Party",
    wordingMode:
      "plural",
    maximumAttendance:
      2,
    additionalGuestAllocations:
      [],
    active: true,
    environment:
      "production",
  };
}

test(
  "production activation snapshot captures all RSVP tabs and accepts empty operational tables",
  async () => {
    const {
      fake,
    } =
      await createInitializedFake();

    const snapshot =
      await readGoogleSheetsStoreSnapshot({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
        now: () =>
          new Date(
            "2026-09-20T22:00:00.000Z",
          ),
      });

    assert.equal(
      snapshot.snapshotVersion,
      1,
    );
    assert.equal(
      snapshot.createdAt,
      "2026-09-20T22:00:00.000Z",
    );

    assert.deepEqual(
      Object.keys(
        snapshot.sections,
      ).sort(),
      [
        "Current RSVPs",
        "Delivery Records",
        "Invitations",
        "RSVP Versions",
        "Resend Records",
        "Submission Records",
      ].sort(),
    );

    assert.equal(
      assertOperationalSectionsEmpty(
        snapshot,
      ),
      true,
    );
  },
);

test(
  "production readiness rejects pre-existing RSVP operational data",
  async () => {
    const {
      fake,
    } =
      await createInitializedFake();

    fake.workbook
      .get("Current RSVPs")
      .push([
        "party-existing",
        1,
        "{}",
      ]);

    const snapshot =
      await readGoogleSheetsStoreSnapshot({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
      });

    assert.throws(
      () =>
        assertOperationalSectionsEmpty(
          snapshot,
        ),
      /requires empty operational RSVP tables/,
    );
  },
);

test(
  "production invitation verification requires an exact private source-to-workbook match",
  async () => {
    const {
      fake,
    } =
      await createInitializedFake();

    const expected = [
      productionInvitation(
        "ABC123",
        "party-prod-a",
      ),
      productionInvitation(
        "DEF456",
        "party-prod-b",
      ),
    ];

    await replaceInvitationConfigurations({
      sheets:
        fake.sheets,
      spreadsheetId:
        "fictional-sheet",
      invitations:
        expected,
      expectedEnvironment:
        "production",
    });

    const snapshot =
      await readGoogleSheetsStoreSnapshot({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
      });

    assert.deepEqual(
      assertProductionInvitationsMatchExpected(
        snapshot,
        expected,
      ),
      {
        invitationCount: 2,
      },
    );

    const changed =
      JSON.parse(
        JSON.stringify(
          snapshot,
        ),
      );

    changed.sections
      .Invitations[1][1] =
      "party-wrong";

    assert.throws(
      () =>
        assertProductionInvitationsMatchExpected(
          changed,
          expected,
        ),
      /configuration mismatch/,
    );
  },
);

test(
  "production invitation activation detects any non-invitation RSVP data change",
  async () => {
    const {
      fake,
    } =
      await createInitializedFake();

    const before =
      await readGoogleSheetsStoreSnapshot({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
      });

    fake.workbook
      .get("Delivery Records")
      .push([
        "party-a",
        "2026-09-20T22:00:00.000Z",
        "{}",
      ]);

    const after =
      await readGoogleSheetsStoreSnapshot({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
      });

    assert.throws(
      () =>
        assertOperationalSectionsUnchanged(
          before,
          after,
        ),
      /changed RSVP operational data/,
    );
  },
);

test(
  "private snapshot is written before activation and prior invitations can be restored",
  async () => {
    const {
      fake,
      registry,
    } =
      await createInitializedFake();

    const before =
      await readGoogleSheetsStoreSnapshot({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
        now: () =>
          new Date(
            "2026-09-20T22:00:00.000Z",
          ),
      });

    const temporaryDirectory =
      await fs.mkdtemp(
        path.join(
          os.tmpdir(),
          "wedding-rsvp-backup-",
        ),
      );

    try {
      const filepath =
        await writePrivateSnapshotFile({
          snapshot: before,
          backupDirectory:
            temporaryDirectory,
          now: () =>
            new Date(
              "2026-09-20T22:01:00.000Z",
            ),
        });

      const backup =
        JSON.parse(
          await fs.readFile(
            filepath,
            "utf8",
          ),
        );

      assert.equal(
        backup.snapshotVersion,
        1,
      );
      assert.equal(
        backup.sections
          .Invitations.length,
        registry.fixtures.length +
          1,
      );

      await replaceInvitationConfigurations({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
        invitations: [
          productionInvitation(
            "ABC123",
            "party-prod-a",
          ),
        ],
        expectedEnvironment:
          "production",
      });

      await restoreInvitationsFromSnapshot({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
        snapshot: before,
      });

      const restored =
        await readGoogleSheetsStoreSnapshot({
          sheets:
            fake.sheets,
          spreadsheetId:
            "fictional-sheet",
      });

      assert.deepEqual(
        restored.sections[
          GOOGLE_SHEETS_STORE_SCHEMA
            .invitations.title
        ],
        before.sections[
          GOOGLE_SHEETS_STORE_SCHEMA
            .invitations.title
        ],
      );
    } finally {
      await fs.rm(
        temporaryDirectory,
        {
          recursive: true,
          force: true,
        },
      );
    }
  },
);
