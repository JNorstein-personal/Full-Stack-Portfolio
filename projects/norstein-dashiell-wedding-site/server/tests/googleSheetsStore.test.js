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

function makeStoredRsvp({
  version,
  eventAttendance = [
    "ceremony",
  ],
} = {}) {
  const includesReception =
    eventAttendance.includes(
      "reception",
    );

  return {
    version,
    eventAttendance,
    namedInviteeResponses: {
      "invitee-dev001-a":
        "yes",
    },
    attendanceTotals: {
      adults21Plus: 1,
      youngAdults18To20: 0,
      children3To17: 0,
      childrenUnder3: 0,
    },
    overallAttendance: 1,
    attendeeDetails: [
      {
        attendeeName:
          "Example Guest",
        ...(includesReception
          ? {
              dietaryPreferences:
                "Vegetarian",
            }
          : {}),
      },
    ],
  };
}

async function createInitializedStore() {
  const fake =
    createFakeSheetsClient();

  const invitation = {
    inviteCode: "DEV001",
    inviteCodeDisplay:
      "DEV-001",
    partyId:
      "party-dev-example",
    partyDisplayName:
      "Example Guest",
    greeting:
      "Welcome, Example Guest!",
    wordingMode: "singular",
    maximumAttendance: 1,
    namedInvitees: [
      {
        id:
          "invitee-dev001-a",
        displayName:
          "Example Guest",
      },
    ],
    additionalGuestAllocations:
      [],
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
  "Google Sheets store round-trips corrected person-level RSVP state while preserving current/version separation",
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

    const initialRsvp =
      makeStoredRsvp({
        version: 1,
        eventAttendance: [
          "ceremony",
        ],
      });
    const revisedRsvp =
      makeStoredRsvp({
        version: 2,
        eventAttendance: [
          "ceremony",
          "reception",
        ],
      });

    await store.appendRsvpVersion(
      invitation.partyId,
      {
        action: "initial",
        recordedAt:
          "2026-09-20T19:00:00.000Z",
        ...initialRsvp,
      },
    );

    await store.replaceCurrentRsvp(
      invitation.partyId,
      initialRsvp,
    );

    await store.appendRsvpVersion(
      invitation.partyId,
      {
        action: "revision",
        recordedAt:
          "2026-09-20T19:05:00.000Z",
        ...revisedRsvp,
      },
    );

    await store.replaceCurrentRsvp(
      invitation.partyId,
      revisedRsvp,
    );

    assert.deepEqual(
      await store.getCurrentRsvp(
        invitation.partyId,
      ),
      revisedRsvp,
    );

    const versions =
      await store
        .listRsvpVersions(
          invitation.partyId,
        );

    assert.deepEqual(
      versions.map(
        (record) =>
          record.version,
      ),
      [1, 2],
    );

    assert.deepEqual(
      versions[0]
        .namedInviteeResponses,
      {
        "invitee-dev001-a":
          "yes",
      },
    );
    assert.equal(
      versions[0]
        .overallAttendance,
      1,
    );
    assert.deepEqual(
      versions[0]
        .attendeeDetails,
      [
        {
          attendeeName:
            "Example Guest",
        },
      ],
    );

    assert.deepEqual(
      versions[1]
        .attendeeDetails,
      [
        {
          attendeeName:
            "Example Guest",
          dietaryPreferences:
            "Vegetarian",
        },
      ],
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


test(
  "Google Sheets mutation commit is idempotent after a complete write",
  async () => {
    const {
      store,
      invitation,
    } =
      await createInitializedStore();

    const currentRsvp =
      makeStoredRsvp({
        version: 1,
      });
    const versionRecord = {
      action: "initial",
      mutationId:
        "mutation-a",
      recordedAt:
        "2026-09-20T20:00:00.000Z",
      ...currentRsvp,
    };

    assert.deepEqual(
      await store
        .commitRsvpMutation(
          invitation.partyId,
          {
            expectedCurrentVersion:
              0,
            mutationId:
              "mutation-a",
            currentRsvp,
            versionRecord,
          },
        ),
      {
        status: "committed",
      },
    );

    assert.deepEqual(
      await store
        .commitRsvpMutation(
          invitation.partyId,
          {
            expectedCurrentVersion:
              0,
            mutationId:
              "mutation-a",
            currentRsvp,
            versionRecord,
          },
        ),
      {
        status:
          "alreadyCommitted",
      },
    );

    assert.equal(
      (
        await store
          .listRsvpVersions(
            invitation.partyId,
          )
      ).length,
      1,
    );
  },
);

test(
  "Google Sheets mutation commit repairs an orphaned matching version row",
  async () => {
    const {
      store,
      invitation,
    } =
      await createInitializedStore();

    const currentRsvp =
      makeStoredRsvp({
        version: 1,
      });

    await store.appendRsvpVersion(
      invitation.partyId,
      {
        action: "initial",
        mutationId:
          "mutation-a",
        recordedAt:
          "2026-09-20T20:00:00.000Z",
        ...currentRsvp,
      },
    );

    assert.deepEqual(
      await store
        .commitRsvpMutation(
          invitation.partyId,
          {
            expectedCurrentVersion:
              0,
            mutationId:
              "mutation-a",
            currentRsvp,
            versionRecord: {
              action:
                "initial",
              mutationId:
                "mutation-a",
              recordedAt:
                "2026-09-20T20:00:00.000Z",
              ...currentRsvp,
            },
          },
        ),
      {
        status: "recovered",
      },
    );

    assert.deepEqual(
      await store.getCurrentRsvp(
        invitation.partyId,
      ),
      currentRsvp,
    );
    assert.equal(
      (
        await store
          .listRsvpVersions(
            invitation.partyId,
          )
      ).length,
      1,
    );
  },
);

test(
  "Google Sheets mutation commit rejects a conflicting mutation for an occupied target version",
  async () => {
    const {
      store,
      invitation,
    } =
      await createInitializedStore();

    await store.appendRsvpVersion(
      invitation.partyId,
      {
        action: "initial",
        mutationId:
          "mutation-a",
        version: 1,
      },
    );

    await assert.rejects(
      () =>
        store.commitRsvpMutation(
          invitation.partyId,
          {
            expectedCurrentVersion:
              0,
            mutationId:
              "mutation-b",
            currentRsvp: {
              version: 1,
            },
            versionRecord: {
              action:
                "initial",
              mutationId:
                "mutation-b",
              version: 1,
            },
          },
        ),
      /conflicting target version/,
    );
  },
);

test(
  "Google Sheets store lists private submission lifecycle records by party",
  async () => {
    const {
      store,
      invitation,
    } =
      await createInitializedStore();

    await store.setSubmissionRecord(
      `${invitation.partyId}:one`,
      {
        fingerprint:
          "fingerprint-a",
        partyId:
          invitation.partyId,
        state: "prepared",
      },
    );
    await store.setSubmissionRecord(
      "party-other:one",
      {
        fingerprint:
          "fingerprint-b",
        partyId:
          "party-other",
        state: "complete",
      },
    );

    assert.deepEqual(
      await store
        .listSubmissionRecordsForParty(
          invitation.partyId,
        ),
      [
        {
          fingerprint:
            "fingerprint-a",
          partyId:
            invitation.partyId,
          state: "prepared",
        },
      ],
    );
  },
);
