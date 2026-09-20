const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInvitationService,
} = require(
  "../src/services/invitationService"
);

function createSource(records = {}) {
  return Object.freeze({
    async findByCanonicalCode(
      canonicalCode,
    ) {
      return records[canonicalCode] || null;
    },
  });
}

const activeDevelopmentInvitation =
  Object.freeze({
    inviteCode: "DEV001",
    partyId: "private-party-id",
    partyDisplayName:
      "Example Guest",
    greeting:
      "Welcome, Example Guest!",
    wordingMode: "singular",
    maximumAttendance: 1,
    additionalGuestAllocations:
      Object.freeze([]),
    active: true,
    environment: "development",
  });

test(
  "service normalizes before exact source lookup",
  async () => {
    const service =
      createInvitationService({
        runtimeEnvironment: "test",
        invitationSource:
          createSource({
            DEV001:
              activeDevelopmentInvitation,
          }),
      });

    const result =
      await service.lookup(
        " d e v - 0 0 1 ",
      );

    assert.equal(
      result.status,
      "found",
    );
    assert.equal(
      result.invitation.partyId,
      "private-party-id",
    );
  },
);

test(
  "service rejects malformed codes without querying storage",
  async () => {
    let lookupCount = 0;

    const service =
      createInvitationService({
        runtimeEnvironment: "test",
        invitationSource:
          Object.freeze({
            async findByCanonicalCode() {
              lookupCount += 1;
              return null;
            },
          }),
      });

    const result =
      await service.lookup(
        "DEV_001",
      );

    assert.equal(
      result.status,
      "malformed",
    );
    assert.equal(lookupCount, 0);
  },
);

test(
  "service makes unknown, inactive, and environment-ineligible records guest-equivalent",
  async () => {
    const service =
      createInvitationService({
        runtimeEnvironment:
          "development",
        invitationSource:
          createSource({
            DEV999: {
              ...activeDevelopmentInvitation,
              inviteCode: "DEV999",
              active: false,
            },
            PRD001: {
              ...activeDevelopmentInvitation,
              inviteCode: "PRD001",
              environment:
                "production",
            },
          }),
      });

    assert.equal(
      (
        await service.lookup(
          "UNK404",
        )
      ).status,
      "notFound",
    );

    assert.equal(
      (
        await service.lookup(
          "DEV999",
        )
      ).status,
      "notFound",
    );

    assert.equal(
      (
        await service.lookup(
          "PRD001",
        )
      ).status,
      "notFound",
    );
  },
);
