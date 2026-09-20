const express = require("express");

const {
  parseLookupRequest,
} = require("../validation/lookup");

const INVALID_INVITATION_RESPONSE =
  Object.freeze({
    error: Object.freeze({
      code: "INVALID_INVITATION",
      message:
        "We couldn't verify that invitation code. Please check it and try again.",
    }),
  });

const RSVP_CLOSED_RESPONSE =
  Object.freeze({
    error: Object.freeze({
      code: "RSVP_CLOSED",
      message:
        "Online RSVP is currently closed. Please use the assistance information on the RSVP page if you need help.",
    }),
  });

const SERVICE_UNAVAILABLE_RESPONSE =
  Object.freeze({
    error: Object.freeze({
      code: "SERVICE_UNAVAILABLE",
      message:
        "RSVP lookup is temporarily unavailable. Please try again later.",
    }),
  });

function buildGuestInvitation(
  invitation,
  environment,
) {
  return {
    partyDisplayName:
      invitation.partyDisplayName,
    greeting: invitation.greeting,
    wordingMode:
      invitation.wordingMode,
    maximumAttendance:
      invitation.maximumAttendance,
    additionalGuestAllocations:
      invitation.additionalGuestAllocations.map(
        ({ id, prompt }) => ({
          id,
          prompt,
        }),
      ),
    deadline:
      environment.RSVP_DEADLINE,
    timeZone:
      environment.RSVP_TIME_ZONE,
  };
}

function buildConfirmationOptions(
  environment,
) {
  const textMessage =
    environment.RSVP_SMS_ENABLED ===
    true;

  return {
    email: true,
    textMessage,
    smsAuthorizationRequired:
      textMessage,
  };
}

function isRsvpClosed(deadline, now) {
  const deadlineTime =
    Date.parse(deadline);

  const currentTime =
    now instanceof Date
      ? now.getTime()
      : Number(now);

  return currentTime >= deadlineTime;
}

function createRsvpRouter({
  invitationService,
  environment,
  questions = Object.freeze([]),
  now = () => new Date(),
}) {
  const router = express.Router();

  router.post(
    "/lookup",
    async (req, res) => {
      const request =
        parseLookupRequest(req.body);

      if (!request) {
        return res
          .status(400)
          .json(
            INVALID_INVITATION_RESPONSE,
          );
      }

      try {
        const result =
          await invitationService.lookup(
            request.inviteCode,
          );

        if (
          result.status ===
          "malformed"
        ) {
          return res
            .status(400)
            .json(
              INVALID_INVITATION_RESPONSE,
            );
        }

        if (
          result.status ===
          "notFound"
        ) {
          return res
            .status(404)
            .json(
              INVALID_INVITATION_RESPONSE,
            );
        }

        if (
          isRsvpClosed(
            environment.RSVP_DEADLINE,
            now(),
          )
        ) {
          return res
            .status(410)
            .json(
              RSVP_CLOSED_RESPONSE,
            );
        }

        return res
          .status(200)
          .json({
            invitation:
              buildGuestInvitation(
                result.invitation,
                environment,
              ),
            questions,
            confirmationOptions:
              buildConfirmationOptions(
                environment,
              ),
          });
      } catch {
        return res
          .status(503)
          .json(
            SERVICE_UNAVAILABLE_RESPONSE,
          );
      }
    },
  );

  return router;
}

module.exports = {
  INVALID_INVITATION_RESPONSE,
  RSVP_CLOSED_RESPONSE,
  SERVICE_UNAVAILABLE_RESPONSE,
  buildConfirmationOptions,
  buildGuestInvitation,
  createRsvpRouter,
  isRsvpClosed,
};
