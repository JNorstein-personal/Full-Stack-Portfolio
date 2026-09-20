const {
  normalizeInvitationCode,
} = require("../rsvp/invitationCode");
const {
  loadDevelopmentInvitationFixtures,
} = require("../rsvp/developmentInvitations");

function isEnvironmentEligible(
  invitationEnvironment,
  runtimeEnvironment,
) {
  if (runtimeEnvironment === "test") {
    return invitationEnvironment === "development";
  }

  return (
    invitationEnvironment ===
    runtimeEnvironment
  );
}

function createDevelopmentInvitationSource({
  runtimeEnvironment,
} = {}) {
  const registry =
    loadDevelopmentInvitationFixtures({
      runtimeEnvironment,
    });

  return Object.freeze({
    async findByCanonicalCode(
      canonicalCode,
    ) {
      return (
        registry.byCanonicalCode[
          canonicalCode
        ] || null
      );
    },
  });
}

function createUnavailableInvitationSource() {
  return Object.freeze({
    async findByCanonicalCode() {
      throw new Error(
        "Invitation configuration source is unavailable.",
      );
    },
  });
}

function createInvitationService({
  runtimeEnvironment,
  invitationSource,
}) {
  if (
    !runtimeEnvironment ||
    !invitationSource ||
    typeof invitationSource.findByCanonicalCode !==
      "function"
  ) {
    throw new Error(
      "Invitation service requires a runtime environment and invitation source.",
    );
  }

  return Object.freeze({
    async lookup(receivedInviteCode) {
      const normalized =
        normalizeInvitationCode(
          receivedInviteCode,
        );

      if (!normalized) {
        return Object.freeze({
          status: "malformed",
        });
      }

      const invitation =
        await invitationSource.findByCanonicalCode(
          normalized.canonicalCode,
        );

      if (
        !invitation ||
        invitation.active !== true ||
        !isEnvironmentEligible(
          invitation.environment,
          runtimeEnvironment,
        )
      ) {
        return Object.freeze({
          status: "notFound",
        });
      }

      return Object.freeze({
        status: "found",
        invitation,
      });
    },
  });
}

module.exports = {
  createDevelopmentInvitationSource,
  createInvitationService,
  createUnavailableInvitationSource,
  isEnvironmentEligible,
};
