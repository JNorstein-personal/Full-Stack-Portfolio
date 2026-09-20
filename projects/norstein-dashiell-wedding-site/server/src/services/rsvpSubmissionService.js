const {
  createHash,
} = require("node:crypto");

const {
  normalizeInvitationCode,
} = require("../rsvp/invitationCode");
const {
  isRsvpClosed,
} = require("../rsvp/deadline");
const {
  parseConfirmation,
  validateInitialChanges,
  validateRevisionChanges,
} = require("../validation/submit");

const RSVP_ASSISTANCE_EMAIL =
  "RSVPhelp@loreweavercreations.com";

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value
      .map(stableStringify)
      .join(",")}]`;
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    return `{${Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify(
            value[key],
          )}`,
      )
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function fingerprintRequest(
  request,
) {
  const changes = JSON.parse(
    JSON.stringify(
      request.changes,
    ),
  );

  const eventValue =
    changes.eventAttendance &&
    changes.eventAttendance
      .operation === "replace" &&
    Array.isArray(
      changes.eventAttendance
        .value,
    )
      ? changes.eventAttendance
          .value
      : null;

  if (
    eventValue &&
    eventValue.length === 2 &&
    eventValue.includes(
      "ceremony",
    ) &&
    eventValue.includes(
      "reception",
    )
  ) {
    changes.eventAttendance.value =
      [
        "ceremony",
        "reception",
      ];
  }

  return createHash("sha256")
    .update(
      stableStringify({
        confirmation:
          request.confirmation,
        changes,
      }),
    )
    .digest("hex");
}

function buildGuestRsvp(
  storedRsvp,
  invitation,
) {
  const guestRsvp = {
    eventAttendance:
      storedRsvp
        .eventAttendance,
  };

  if (
    storedRsvp
      .additionalGuestResponses
  ) {
    guestRsvp
      .additionalGuestResponses =
      invitation
        .additionalGuestAllocations
        .map(
          (allocation) => ({
            id: allocation.id,
            prompt:
              allocation.prompt,
            response:
              storedRsvp
                .additionalGuestResponses[
                allocation.id
              ],
          }),
        );
  }

  if (
    storedRsvp
      .attendanceTotals
  ) {
    guestRsvp.attendanceTotals =
      storedRsvp
        .attendanceTotals;
    guestRsvp.overallAttendance =
      storedRsvp
        .overallAttendance;
  }

  if (
    storedRsvp
      .receptionAttendeeDetails
  ) {
    guestRsvp
      .receptionAttendeeDetails =
      storedRsvp
        .receptionAttendeeDetails;
  }

  return guestRsvp;
}

function buildSuccessResponse({
  invitation,
  storedRsvp,
  confirmation,
  recordedAt,
  delivery,
  action,
  idempotentRepeat,
}) {
  const deliveryWarning =
    delivery.guestDeliveryStatus !==
      "sent" ||
    delivery
      .administrativeDeliveryStatus !==
      "sent";

  return {
    submission: {
      recorded: true,
      action,
      idempotentRepeat,
      recordedAt,
    },
    invitation: {
      partyDisplayName:
        invitation
          .partyDisplayName,
      wordingMode:
        invitation.wordingMode,
    },
    rsvp: buildGuestRsvp(
      storedRsvp,
      invitation,
    ),
    confirmation: {
      method:
        confirmation.method,
      guestDeliveryStatus:
        delivery
          .guestDeliveryStatus,
      administrativeDeliveryStatus:
        delivery
          .administrativeDeliveryStatus,
      deliveryWarning,
    },
    revisionPolicy: {
      mayRevise: true,
      deadline:
        storedRsvp.deadline,
      timeZone:
        storedRsvp.timeZone,
      assistanceEmail:
        RSVP_ASSISTANCE_EMAIL,
    },
  };
}

function createRsvpSubmissionService({
  invitationService,
  rsvpStore,
  deliveryService,
  environment,
  now = () => new Date(),
}) {
  if (
    !invitationService ||
    !rsvpStore ||
    !deliveryService ||
    !environment
  ) {
    throw new Error(
      "RSVP submission service requires invitation, storage, delivery, and environment dependencies.",
    );
  }

  return Object.freeze({
    async submit(request) {
      const normalized =
        normalizeInvitationCode(
          request.inviteCode,
        );

      if (!normalized) {
        return {
          status:
            "badRequest",
        };
      }

      const invitationResult =
        await invitationService.lookup(
          request.inviteCode,
        );

      if (
        invitationResult.status ===
        "malformed"
      ) {
        return {
          status:
            "badRequest",
        };
      }

      if (
        invitationResult.status ===
        "notFound"
      ) {
        return {
          status:
            "forbidden",
        };
      }

      const invitation =
        invitationResult.invitation;

      const fingerprint =
        fingerprintRequest(
          request,
        );

      const idempotencyKey =
        `${invitation.partyId}:${request.clientSubmissionId}`;

      const priorSubmission =
        await rsvpStore
          .getSubmissionRecord(
            idempotencyKey,
          );

      if (priorSubmission) {
        if (
          priorSubmission
            .fingerprint !==
          fingerprint
        ) {
          return {
            status:
              "badRequest",
          };
        }

        return {
          status:
            "success",
          httpStatus: 200,
          response: {
            ...priorSubmission
              .response,
            submission: {
              ...priorSubmission
                .response
                .submission,
              idempotentRepeat:
                true,
            },
          },
        };
      }

      if (
        isRsvpClosed(
          environment
            .RSVP_DEADLINE,
          now(),
        )
      ) {
        return {
          status: "closed",
        };
      }

      const confirmation =
        parseConfirmation(
          request.confirmation,
          {
            email: true,
            textMessage:
              environment
                .RSVP_SMS_ENABLED ===
              true,
            smsAuthorizationRequired:
              environment
                .RSVP_SMS_ENABLED ===
              true,
          },
        );

      if (!confirmation.ok) {
        return {
          status:
            confirmation.status ===
            403
              ? "forbidden"
              : "badRequest",
        };
      }

      const current =
        await rsvpStore
          .getCurrentRsvp(
            invitation.partyId,
          );

      const action =
        current
          ? "revision"
          : "initial";

      const substantive =
        current
          ? validateRevisionChanges(
              request.changes,
              invitation,
              current,
            )
          : validateInitialChanges(
              request.changes,
              invitation,
            );

      if (!substantive.ok) {
        return {
          status:
            substantive.status ===
            403
              ? "forbidden"
              : "badRequest",
        };
      }

      const recordedAt =
        now().toISOString();

      const storedRsvp = {
        ...substantive.value,
        confirmation:
          confirmation.value,
        recordedAt,
        deadline:
          environment
            .RSVP_DEADLINE,
        timeZone:
          environment
            .RSVP_TIME_ZONE,
        version:
          current
            ? current.version + 1
            : 1,
      };

      await rsvpStore
        .appendRsvpVersion(
          invitation.partyId,
          {
            action,
            ...storedRsvp,
          },
        );

      await rsvpStore
        .replaceCurrentRsvp(
          invitation.partyId,
          storedRsvp,
        );

      let delivery;

      try {
        delivery =
          await deliveryService.deliver({
            invitation,
            rsvp:
              storedRsvp,
            confirmation:
              confirmation.value,
            action,
          });
      } catch {
        delivery = {
          guestDeliveryStatus:
            "uncertain",
          administrativeDeliveryStatus:
            "uncertain",
        };
      }

      const response =
        buildSuccessResponse({
          invitation,
          storedRsvp,
          confirmation:
            confirmation.value,
          recordedAt,
          delivery,
          action,
          idempotentRepeat:
            false,
        });

      await rsvpStore
        .appendDeliveryRecord(
          invitation.partyId,
          {
            recordedAt,
            guest:
              delivery
                .guestDeliveryStatus,
            administrative:
              delivery
                .administrativeDeliveryStatus,
          },
        );

      await rsvpStore
        .setSubmissionRecord(
          idempotencyKey,
          {
            fingerprint,
            response,
          },
        );

      return {
        status: "success",
        httpStatus:
          action === "initial"
            ? 201
            : 200,
        response,
      };
    },
  });
}

module.exports = {
  RSVP_ASSISTANCE_EMAIL,
  buildGuestRsvp,
  createRsvpSubmissionService,
  fingerprintRequest,
};
