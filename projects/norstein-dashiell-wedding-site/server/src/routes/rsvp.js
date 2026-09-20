const express = require("express");

const {
  isRsvpClosed,
} = require("../rsvp/deadline");
const {
  parseLookupRequest,
} = require("../validation/lookup");
const {
  parseSubmitRequest,
} = require("../validation/submit");

const INVALID_INVITATION_RESPONSE =
  Object.freeze({
    error: Object.freeze({
      code: "INVALID_INVITATION",
      message:
        "We couldn't verify that invitation code. Please check it and try again.",
    }),
  });

const INVALID_SUBMISSION_RESPONSE =
  Object.freeze({
    error: Object.freeze({
      code: "INVALID_SUBMISSION",
      message:
        "We couldn't record that RSVP because some submitted information is invalid. Please review the form and try again.",
    }),
  });

const SUBMISSION_FORBIDDEN_RESPONSE =
  Object.freeze({
    error: Object.freeze({
      code: "RSVP_NOT_AUTHORIZED",
      message:
        "That RSVP request is not authorized for this invitation or current configuration.",
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
        "The RSVP service is temporarily unavailable. Please try again later.",
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

function createRsvpRouter({
  invitationService,
  submissionService,
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

  router.post(
    "/submit",
    async (req, res) => {
      const parsed =
        parseSubmitRequest(req.body);

      if (!parsed.ok) {
        return res
          .status(400)
          .json(
            INVALID_SUBMISSION_RESPONSE,
          );
      }

      try {
        const result =
          await submissionService.submit(
            parsed.value,
          );

        if (
          result.status ===
          "badRequest"
        ) {
          return res
            .status(400)
            .json(
              INVALID_SUBMISSION_RESPONSE,
            );
        }

        if (
          result.status ===
          "forbidden"
        ) {
          return res
            .status(403)
            .json(
              SUBMISSION_FORBIDDEN_RESPONSE,
            );
        }

        if (
          result.status ===
          "closed"
        ) {
          return res
            .status(410)
            .json(
              RSVP_CLOSED_RESPONSE,
            );
        }

        if (
          result.status ===
          "revisionDeferred"
        ) {
          return res
            .status(503)
            .json(
              SERVICE_UNAVAILABLE_RESPONSE,
            );
        }

        if (
          result.status ===
          "success"
        ) {
          return res
            .status(
              result.httpStatus,
            )
            .json(
              result.response,
            );
        }

        return res
          .status(503)
          .json(
            SERVICE_UNAVAILABLE_RESPONSE,
          );
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
  INVALID_SUBMISSION_RESPONSE,
  RSVP_CLOSED_RESPONSE,
  SERVICE_UNAVAILABLE_RESPONSE,
  SUBMISSION_FORBIDDEN_RESPONSE,
  buildConfirmationOptions,
  buildGuestInvitation,
  createRsvpRouter,
  isRsvpClosed,
};
