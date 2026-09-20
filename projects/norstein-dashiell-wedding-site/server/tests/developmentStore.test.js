const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createDevelopmentStore,
} = require(
  "../src/services/storage/developmentStore"
);

function makeInvitation() {
  return {
    inviteCode: "DEV001",
    partyId: "party-dev-a",
    partyDisplayName:
      "Example Guest",
    active: true,
    environment: "development",
  };
}

test(
  "development store keeps invitation configuration private and returns immutable clones",
  async () => {
    const invitation =
      makeInvitation();

    const store =
      createDevelopmentStore({
        invitations: [
          invitation,
        ],
      });

    invitation.partyDisplayName =
      "Mutated Outside Store";

    const loaded =
      await store
        .findInvitationByCanonicalCode(
          "DEV001",
        );

    assert.equal(
      loaded.partyDisplayName,
      "Example Guest",
    );
    assert.equal(
      Object.isFrozen(loaded),
      true,
    );

    assert.equal(
      await store
        .findInvitationByCanonicalCode(
          "UNKNOWN",
        ),
      null,
    );
  },
);

test(
  "development store keeps current RSVP separate from preserved version history",
  async () => {
    const store =
      createDevelopmentStore();

    await store.appendRsvpVersion(
      "party-dev-a",
      {
        version: 1,
        attendance: "ceremony",
      },
    );

    await store.replaceCurrentRsvp(
      "party-dev-a",
      {
        version: 1,
        attendance: "ceremony",
      },
    );

    await store.appendRsvpVersion(
      "party-dev-a",
      {
        version: 2,
        attendance: "reception",
      },
    );

    await store.replaceCurrentRsvp(
      "party-dev-a",
      {
        version: 2,
        attendance: "reception",
      },
    );

    assert.deepEqual(
      await store.getCurrentRsvp(
        "party-dev-a",
      ),
      {
        version: 2,
        attendance: "reception",
      },
    );

    assert.deepEqual(
      await store.listRsvpVersions(
        "party-dev-a",
      ),
      [
        {
          version: 1,
          attendance:
            "ceremony",
        },
        {
          version: 2,
          attendance:
            "reception",
        },
      ],
    );
  },
);

test(
  "development store keeps idempotency records separate from RSVP state",
  async () => {
    const store =
      createDevelopmentStore();

    await store.setSubmissionRecord(
      "submission-1",
      {
        fingerprint:
          "fictional-fingerprint",
        partyId: "party-dev-a",
      },
    );

    assert.deepEqual(
      await store.getSubmissionRecord(
        "submission-1",
      ),
      {
        fingerprint:
          "fictional-fingerprint",
        partyId: "party-dev-a",
      },
    );

    assert.equal(
      await store.getCurrentRsvp(
        "party-dev-a",
      ),
      null,
    );
  },
);

test(
  "development store records delivery attempts independently from resend operations",
  async () => {
    const store =
      createDevelopmentStore();

    await store.appendDeliveryRecord(
      "party-dev-a",
      {
        channel: "email",
        status: "sent",
      },
    );

    await store.appendResendRecord(
      "party-dev-a",
      {
        channel: "email",
        requestedBy:
          "administrator",
      },
    );

    assert.deepEqual(
      await store.listDeliveryRecords(
        "party-dev-a",
      ),
      [
        {
          channel: "email",
          status: "sent",
        },
      ],
    );

    assert.deepEqual(
      await store.listResendRecords(
        "party-dev-a",
      ),
      [
        {
          channel: "email",
          requestedBy:
            "administrator",
        },
      ],
    );
  },
);

test(
  "development store rejects duplicate or malformed invitation seed records",
  () => {
    assert.throws(
      () =>
        createDevelopmentStore({
          invitations: [
            makeInvitation(),
            makeInvitation(),
          ],
        }),
      /invalid or duplicate invitation configuration/,
    );

    assert.throws(
      () =>
        createDevelopmentStore({
          invitations: [
            {
              partyId:
                "missing-code",
            },
          ],
        }),
      /invalid or duplicate invitation configuration/,
    );
  },
);


test(
  "development store commits a mutation once and recognizes an exact replay",
  async () => {
    const store =
      createDevelopmentStore();

    const currentRsvp = {
      version: 1,
      eventAttendance: [
        "ceremony",
      ],
    };
    const versionRecord = {
      action: "initial",
      mutationId:
        "mutation-a",
      ...currentRsvp,
    };

    assert.deepEqual(
      await store
        .commitRsvpMutation(
          "party-dev-a",
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
          "party-dev-a",
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
            "party-dev-a",
          )
      ).length,
      1,
    );
  },
);

test(
  "development store repairs an orphaned version record without appending a duplicate",
  async () => {
    const store =
      createDevelopmentStore();

    const currentRsvp = {
      version: 1,
      eventAttendance: [
        "ceremony",
      ],
    };

    await store.appendRsvpVersion(
      "party-dev-a",
      {
        action: "initial",
        mutationId:
          "mutation-a",
        ...currentRsvp,
      },
    );

    assert.deepEqual(
      await store
        .commitRsvpMutation(
          "party-dev-a",
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
        "party-dev-a",
      ),
      currentRsvp,
    );
    assert.equal(
      (
        await store
          .listRsvpVersions(
            "party-dev-a",
          )
      ).length,
      1,
    );
  },
);

test(
  "development store rejects a conflicting mutation for an occupied target version",
  async () => {
    const store =
      createDevelopmentStore();

    await store.appendRsvpVersion(
      "party-dev-a",
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
          "party-dev-a",
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
  "development store lists private submission lifecycle records by party",
  async () => {
    const store =
      createDevelopmentStore();

    await store.setSubmissionRecord(
      "party-dev-a:one",
      {
        partyId:
          "party-dev-a",
        state: "prepared",
      },
    );
    await store.setSubmissionRecord(
      "party-dev-b:one",
      {
        partyId:
          "party-dev-b",
        state: "complete",
      },
    );

    assert.deepEqual(
      await store
        .listSubmissionRecordsForParty(
          "party-dev-a",
        ),
      [
        {
          partyId:
            "party-dev-a",
          state: "prepared",
        },
      ],
    );
  },
);
