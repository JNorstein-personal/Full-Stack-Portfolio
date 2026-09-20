const test = require("node:test");
const assert = require("node:assert/strict");

const {
  assertRsvpStorageContract,
} = require(
  "../src/services/storage/storageContract"
);
const {
  createGoogleSheetsStore,
} = require(
  "../src/services/storage/googleSheetsStore"
);
const {
  initializeDevelopmentGoogleSheetsStore,
} = require(
  "../src/services/storage/googleSheetsStoreSetup"
);
const {
  createFakeSheetsClient,
} = require("./helpers/fakeGoogleSheets");

async function createInitializedStore() {
  const fake =
    createFakeSheetsClient();

  const invitation = {
    inviteCode: "DEV001",
    partyId:
      "party-dev-example",
    partyDisplayName:
      "Example Guest",
    active: true,
    environment: "development",
  };

  await initializeDevelopmentGoogleSheetsStore({
    sheets:
      fake.sheets,
    spreadsheetId:
      "fictional-sheet",
    invitations: [
      invitation,
    ],
  });

  const store =
    createGoogleSheetsStore({
      sheets:
        fake.sheets,
      spreadsheetId:
        "fictional-sheet",
    });

  return {
    fake,
    store,
    invitation,
  };
}

test(
  "Google Sheets store satisfies the persistence-only RSVP storage contract",
  async () => {
    const { store } =
      await createInitializedStore();

    assert.equal(
      assertRsvpStorageContract(
        store,
      ),
      store,
    );
  },
);

test(
  "Google Sheets store reads private invitation configuration and preserves current/version separation",
  async () => {
    const {
      store,
      invitation,
    } =
      await createInitializedStore();

    const loaded =
      await store
        .findInvitationByCanonicalCode(
          "DEV001",
        );

    assert.deepEqual(
      loaded,
      invitation,
    );
    assert.equal(
      Object.isFrozen(loaded),
      true,
    );

    assert.equal(
      await store
        .getCurrentRsvp(
          invitation.partyId,
        ),
      null,
    );

    await store.appendRsvpVersion(
      invitation.partyId,
      {
        action: "initial",
        version: 1,
        recordedAt:
          "2026-09-20T19:00:00.000Z",
        eventAttendance: [
          "ceremony",
        ],
      },
    );

    await store.replaceCurrentRsvp(
      invitation.partyId,
      {
        version: 1,
        eventAttendance: [
          "ceremony",
        ],
      },
    );

    await store.appendRsvpVersion(
      invitation.partyId,
      {
        action: "revision",
        version: 2,
        recordedAt:
          "2026-09-20T19:05:00.000Z",
        eventAttendance: [
          "reception",
        ],
      },
    );

    await store.replaceCurrentRsvp(
      invitation.partyId,
      {
        version: 2,
        eventAttendance: [
          "reception",
        ],
      },
    );

    assert.deepEqual(
      await store.getCurrentRsvp(
        invitation.partyId,
      ),
      {
        version: 2,
        eventAttendance: [
          "reception",
        ],
      },
    );

    assert.deepEqual(
      (
        await store
          .listRsvpVersions(
            invitation.partyId,
          )
      ).map(
        (record) =>
          record.version,
      ),
      [1, 2],
    );
  },
);

test(
  "Google Sheets store upserts idempotency records and appends delivery and resend history independently",
  async () => {
    const {
      store,
      invitation,
    } =
      await createInitializedStore();

    await store.setSubmissionRecord(
      "party:submission-1",
      {
        fingerprint:
          "fingerprint-a",
        response: {
          ok: true,
        },
      },
    );

    await store.setSubmissionRecord(
      "party:submission-1",
      {
        fingerprint:
          "fingerprint-b",
        response: {
          ok: true,
          updated: true,
        },
      },
    );

    assert.deepEqual(
      await store.getSubmissionRecord(
        "party:submission-1",
      ),
      {
        fingerprint:
          "fingerprint-b",
        response: {
          ok: true,
          updated: true,
        },
      },
    );

    await store.appendDeliveryRecord(
      invitation.partyId,
      {
        recordedAt:
          "2026-09-20T19:10:00.000Z",
        guest: "sent",
      },
    );

    await store.appendResendRecord(
      invitation.partyId,
      {
        recordedAt:
          "2026-09-20T19:15:00.000Z",
        requestedBy:
          "administrator",
      },
    );

    assert.equal(
      (
        await store
          .listDeliveryRecords(
            invitation.partyId,
          )
      ).length,
      1,
    );
    assert.equal(
      (
        await store
          .listResendRecords(
            invitation.partyId,
          )
      ).length,
      1,
    );
  },
);

test(
  "Google Sheets store rejects malformed private JSON rather than returning partial state",
  async () => {
    const {
      fake,
      store,
      invitation,
    } =
      await createInitializedStore();

    fake.workbook
      .get("Current RSVPs")
      .push([
        invitation.partyId,
        1,
        "{",
      ]);

    await assert.rejects(
      () =>
        store.getCurrentRsvp(
          invitation.partyId,
        ),
      /invalid JSON/,
    );
  },
);
