const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const {
  rsvpNoStore,
} = require("./middleware/cacheControl");
const {
  createRsvpRouter,
  INVALID_INVITATION_RESPONSE,
} = require("./routes/rsvp");
const {
  createDevelopmentInvitationSource,
  createInvitationService,
  createUnavailableInvitationSource,
} = require("./services/invitationService");

function createDefaultInvitationSource(
  environment,
) {
  if (
    environment.NODE_ENV ===
      "development" ||
    environment.NODE_ENV === "test"
  ) {
    return createDevelopmentInvitationSource({
      runtimeEnvironment:
        environment.NODE_ENV,
    });
  }

  return createUnavailableInvitationSource();
}

function createApp({
  environment,
  invitationSource,
  questions,
  now,
} = {}) {
  if (!environment) {
    throw new Error(
      "createApp requires validated server environment configuration.",
    );
  }

  const app = express();

  app.use(helmet());

  app.use(
    "/wedding/api/rsvp",
    rsvpNoStore,
  );

  app.use(express.json());

  app.use(
    "/wedding/api/rsvp",
    (
      error,
      req,
      res,
      next,
    ) => {
      if (
        error &&
        error.type ===
          "entity.parse.failed"
      ) {
        return res
          .status(400)
          .json(
            INVALID_INVITATION_RESPONSE,
          );
      }

      return next(error);
    },
  );

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  });

  app.use(
    "/wedding/api",
    apiLimiter,
  );

  app.get(
    "/wedding/api/health",
    (req, res) => {
      res.json({
        status: "ok",
        application:
          "Norstein-Dashiell Wedding Website",
      });
    },
  );

  const effectiveInvitationSource =
    invitationSource ||
    createDefaultInvitationSource(
      environment,
    );

  const invitationService =
    createInvitationService({
      runtimeEnvironment:
        environment.NODE_ENV,
      invitationSource:
        effectiveInvitationSource,
    });

  app.use(
    "/wedding/api/rsvp",
    createRsvpRouter({
      invitationService,
      environment,
      questions,
      now,
    }),
  );

  return app;
}

module.exports = {
  createApp,
};
