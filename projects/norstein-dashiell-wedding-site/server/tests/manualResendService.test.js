const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInvitationService,
} = require("../src/services/invitationService");
const {
  createManualResendService,
} = require("../src/services/manualResendService");
const {
  createDevelopmentStore,
} = require("../src/services/storage/developmentStore");

const NOW = new Date(
  "2026-09-20T20:30:00.000Z",
);

function makeInvitation() {
  return {
    inviteCode: "ABC123",
    inviteCodeDisplay:
      "ABC-123",
    partyId: "party-example",
    partyDisplayName:
      "Example Guest",
    greeting:
      "Example Guest",
    wordingMode: "singular",
    maximumAttendance: 1,
    additionalGuestAllocations:
      [],
    active: true,
    environment: "development",
  };
}

function createFixture() {
  const invitation =
    makeInvitation();

  const store =
    createDevelopmentStore({
      invitations: [
        invitation,
      ],
    });

  const invitationService =
    createInvitationService({
      runtimeEnvironment:
        "test",
      invitationSource: {
        async findByCanonicalCode(
          canonicalCode,
        ) {
          return store
            .findInvitationByCanonicalCode(
              canonicalCode,
            );
        },
      },
    });

  return {
    invitation,
    store,
    invitationService,
  };
}

async function seedCurrent(
  store,
  {
    version = 1,
    action = "initial",
  } = {},
) {
  const current = {
    eventAttendance: [
      "ceremony",
    ],
    attendanceTotals: {
      adults21Plus: 1,
      youngAdults18To20: 0,
      children3To17: 0,
      childrenUnder3: 0,
    },
    overallAttendance: 1,
    confirmation: {
      method: "email",
      email:
        "guest@example.com",
    },
    recordedAt:
      "2026-09-20T20:00:00.000Z",
    deadline:
      "2027-03-01T23:59:00-05:00",
    timeZone:
      "America/New_York",
    version,
  };

  await store.appendRsvpVersion(
    "party-example",
    {
      action,
      ...current,
    },
  );

  await store.replaceCurrentRsvp(
    "party-example",
    current,
  );

  return current;
}

test(
  "manual resend sends the complete current RSVP and records a separate resend without changing RSVP state",
  async () => {
    const fixture =
      createFixture();

    const original =
      await seedCurrent(
        fixture.store,
        {
          version: 2,
          action: "revision",
        },
      );

    let delivered;

    const service =
      createManualResendService({
        invitationService:
          fixture.invitationService,
        rsvpStore:
          fixture.store,
        deliveryService: {
          async resendGuest(
            input,
          ) {
            delivered = input;
            return "sent";
          },
        },
        now: () => NOW,
      });

    const result =
      await service.resend(
        "abc-123",
      );

    assert.deepEqual(
      result,
      {
        status: "recorded",
        result: "sent",
        version: 2,
        recordedAt:
          NOW.toISOString(),
      },
    );

    assert.equal(
      delivered.action,
      "revision",
    );
    assert.deepEqual(
      delivered.rsvp,
      original,
    );
    assert.deepEqual(
      delivered.confirmation,
      original.confirmation,
    );

    assert.deepEqual(
      await fixture.store
        .getCurrentRsvp(
          "party-example",
        ),
      original,
    );

    assert.equal(
      (
        await fixture.store
          .listRsvpVersions(
            "party-example",
          )
      ).length,
      1,
    );

    assert.deepEqual(
      await fixture.store
        .listResendRecords(
          "party-example",
        ),
      [
        {
          recordedAt:
            NOW.toISOString(),
          requestedBy:
            "administrator",
          version: 2,
          guest: {
            method: "email",
            destination:
              "guest@example.com",
            status: "sent",
          },
        },
      ],
    );
  },
);

test(
  "manual resend records uncertain delivery without mutating the RSVP when delivery throws",
  async () => {
    const fixture =
      createFixture();

    const original =
      await seedCurrent(
        fixture.store,
      );

    const service =
      createManualResendService({
        invitationService:
          fixture.invitationService,
        rsvpStore:
          fixture.store,
        deliveryService: {
          async resendGuest() {
            throw new Error(
              "fictional provider outage",
            );
          },
        },
        now: () => NOW,
      });

    const result =
      await service.resend(
        "ABC123",
      );

    assert.equal(
      result.result,
      "uncertain",
    );

    assert.deepEqual(
      await fixture.store
        .getCurrentRsvp(
          "party-example",
        ),
      original,
    );

    assert.equal(
      (
        await fixture.store
          .listRsvpVersions(
            "party-example",
          )
      ).length,
      1,
    );

    assert.equal(
      (
        await fixture.store
          .listResendRecords(
            "party-example",
          )
      )[0].guest.status,
      "uncertain",
    );
  },
);

test(
  "manual resend refuses unknown invitations and invitations with no stored RSVP",
  async () => {
    const fixture =
      createFixture();

    let deliveryCount = 0;

    const service =
      createManualResendService({
        invitationService:
          fixture.invitationService,
        rsvpStore:
          fixture.store,
        deliveryService: {
          async resendGuest() {
            deliveryCount += 1;
            return "sent";
          },
        },
      });

    assert.deepEqual(
      await service.resend(
        "ZZZ999",
      ),
      {
        status: "notFound",
      },
    );

    assert.deepEqual(
      await service.resend(
        "ABC123",
      ),
      {
        status: "notFound",
      },
    );

    assert.equal(
      deliveryCount,
      0,
    );

    assert.deepEqual(
      await fixture.store
        .listResendRecords(
          "party-example",
        ),
      [],
    );
  },
);

test(
  "manual resend falls back to stored version number when version history action is unavailable",
  async () => {
    const fixture =
      createFixture();

    await fixture.store
      .replaceCurrentRsvp(
        "party-example",
        {
          eventAttendance: [
            "decline",
          ],
          confirmation: {
            method: "email",
            email:
              "guest@example.com",
          },
          recordedAt:
            "2026-09-20T20:00:00.000Z",
          deadline:
            "2027-03-01T23:59:00-05:00",
          timeZone:
            "America/New_York",
          version: 1,
        },
      );

    let action;

    const service =
      createManualResendService({
        invitationService:
          fixture.invitationService,
        rsvpStore:
          fixture.store,
        deliveryService: {
          async resendGuest(
            input,
          ) {
            action =
              input.action;
            return "sent";
          },
        },
      });

    await service.resend(
      "ABC123",
    );

    assert.equal(
      action,
      "initial",
    );
  },
);


test(
  "manual resend normalizes an invalid delivery status to uncertain before recording",
  async () => {
    const fixture =
      createFixture();

    await seedCurrent(
      fixture.store,
    );

    const service =
      createManualResendService({
        invitationService:
          fixture.invitationService,
        rsvpStore:
          fixture.store,
        deliveryService: {
          async resendGuest() {
            return "provider-specific-value";
          },
        },
        now: () => NOW,
      });

    const result =
      await service.resend(
        "ABC123",
      );

    assert.equal(
      result.result,
      "uncertain",
    );

    assert.equal(
      (
        await fixture.store
          .listResendRecords(
            "party-example",
          )
      )[0].guest.status,
      "uncertain",
    );
  },
);
