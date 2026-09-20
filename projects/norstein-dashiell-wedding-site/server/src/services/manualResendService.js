const {
  buildResendRecord,
} = require("./deliveryRecord");
const {
  normalizeTransportStatus,
} = require("./emailTransport");

function createManualResendService({
  invitationService,
  rsvpStore,
  deliveryService,
  now = () => new Date(),
} = {}) {
  if (
    !invitationService ||
    !rsvpStore ||
    !deliveryService ||
    typeof deliveryService
      .resendGuest !==
      "function"
  ) {
    throw new Error(
      "Manual resend service requires invitation, storage, and guest-resend delivery dependencies.",
    );
  }

  return Object.freeze({
    async resend(
      receivedInviteCode,
    ) {
      const invitationResult =
        await invitationService.lookup(
          receivedInviteCode,
        );

      if (
        invitationResult.status !==
        "found"
      ) {
        return Object.freeze({
          status: "notFound",
        });
      }

      const invitation =
        invitationResult.invitation;

      const current =
        await rsvpStore
          .getCurrentRsvp(
            invitation.partyId,
          );

      if (!current) {
        return Object.freeze({
          status: "notFound",
        });
      }

      const versions =
        await rsvpStore
          .listRsvpVersions(
            invitation.partyId,
          );

      const latestVersion =
        versions.length > 0
          ? versions[
              versions.length - 1
            ]
          : null;

      const action =
        latestVersion &&
        (
          latestVersion.action ===
            "initial" ||
          latestVersion.action ===
            "revision"
        )
          ? latestVersion.action
          : current.version === 1
            ? "initial"
            : "revision";

      const recordedAt =
        now().toISOString();

      let status;

      try {
        status =
          normalizeTransportStatus(
            await deliveryService
              .resendGuest({
                invitation,
                rsvp: current,
                confirmation:
                  current.confirmation,
                action,
              }),
          );
      } catch {
        status = "uncertain";
      }

      const record =
        buildResendRecord({
          recordedAt,
          version:
            current.version,
          confirmation:
            current.confirmation,
          status,
        });

      await rsvpStore
        .appendResendRecord(
          invitation.partyId,
          record,
        );

      return Object.freeze({
        status: "recorded",
        result: status,
        version:
          current.version,
        recordedAt,
      });
    },
  });
}

module.exports = {
  createManualResendService,
};
