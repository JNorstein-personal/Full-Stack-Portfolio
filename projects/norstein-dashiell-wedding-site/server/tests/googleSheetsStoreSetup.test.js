const test = require("node:test");
const assert = require("node:assert/strict");

const {
  loadDevelopmentInvitationFixtures,
} = require("../src/rsvp/developmentInvitations");
const {
  GOOGLE_SHEETS_STORE_SECTIONS,
} = require(
  "../src/services/storage/googleSheetsStoreSchema"
);
const {
  initializeDevelopmentGoogleSheetsStore,
  verifyGoogleSheetsStoreSchema,
} = require(
  "../src/services/storage/googleSheetsStoreSetup"
);
const {
  createFakeSheetsClient,
} = require("./helpers/fakeGoogleSheets");

test(
  "development Google Sheets initializer creates the private store tabs, headers, and fictional invitations",
  async () => {
    const fake =
      createFakeSheetsClient({
        initialSheets: {
          "Current RSVPs": [
            [
              "old-header",
            ],
            [
              "party-existing",
              1,
              "{}",
            ],
          ],
        },
      });

    const registry =
      loadDevelopmentInvitationFixtures({
        runtimeEnvironment:
          "test",
      });

    const result =
      await initializeDevelopmentGoogleSheetsStore({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
        invitations:
          registry.fixtures,
      });

    assert.equal(
      result.invitationCount,
      11,
    );

    for (
      const section of
      GOOGLE_SHEETS_STORE_SECTIONS
    ) {
      assert.equal(
        fake.workbook.has(
          section.title,
        ),
        true,
      );
      assert.deepEqual(
        fake.workbook.get(
          section.title,
        )[0],
        [...section.headers],
      );
    }

    assert.equal(
      fake.workbook
        .get("Invitations")
        .slice(1)
        .filter(
          (row) =>
            row[0] !==
            undefined,
        )
        .length,
      11,
    );

    assert.equal(
      fake.workbook
        .get("Current RSVPs")[1][0],
      "party-existing",
    );
  },
);

test(
  "Google Sheets store schema verification accepts exact headers and rejects drift",
  async () => {
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

    assert.equal(
      await verifyGoogleSheetsStoreSchema({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
      }),
      true,
    );

    fake.workbook.get(
      "Delivery Records",
    )[0][1] =
      "unexpectedHeader";

    await assert.rejects(
      () =>
        verifyGoogleSheetsStoreSchema({
          sheets:
            fake.sheets,
          spreadsheetId:
            "fictional-sheet",
        }),
      /schema verification failed/,
    );
  },
);
