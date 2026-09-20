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
