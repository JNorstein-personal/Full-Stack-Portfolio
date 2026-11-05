const express = require("express");
const helmet = require("helmet");

const {
  parseTrustProxySetting,
} = require("./config/trustProxy");
const {
  rsvpNoStore,
} = require("./middleware/cacheControl");
const {
  createRsvpOriginGuard,
} = require("./middleware/originGuard");
const {
  createRsvpRateLimiters,
} = require("./middleware/rateLimit");
const {
  createProductionConsoleLogger,
  createSafeRequestAudit,
} = require("./middleware/requestAudit");
const {
  createAnalyticsOriginGuard,
  createAnalyticsRouter,
} = require("./routes/analytics");
const {
  createRsvpRouter,
  INVALID_INVITATION_RESPONSE,
  INVALID_SUBMISSION_RESPONSE,
  SERVICE_UNAVAILABLE_RESPONSE,
} = require("./routes/rsvp");
const {
  loadDevelopmentInvitationFixtures,
} = require("./rsvp/developmentInvitations");
const {
  loadReusableRsvpQuestions,
} = require("./rsvp/formSchemas");
const {
  createConfiguredDeliveryService,
} = require("./services/deliveryService");
const {
  createInvitationService,
} = require("./services/invitationService");
const {
  createDevelopmentAnalyticsStore,
} = require(
  "./services/analytics/developmentAnalyticsStore",
);
const {
  createGoogleSheetsAnalyticsStore,
} = require(
  "./services/analytics/googleSheetsAnalyticsStore",
);
const {
  createUnavailableAnalyticsStore,
} = require(
  "./services/analytics/unavailableAnalyticsStore",
);
const {
  createRsvpSubmissionService,
} = require("./services/rsvpSubmissionService");
const {
  createDevelopmentStore,
} = require("./services/storage/developmentStore");
const {
  createGoogleSheetsConnection,
} = require("./services/storage/googleSheetsConnection");
const {
  createGoogleSheetsStore,
} = require("./services/storage/googleSheetsStore");
const {
  createUnavailableStore,
} = require("./services/storage/unavailableStore");

function createDefaultRsvpStore(
  environment,
) {
  if (
    environment.NODE_ENV ===
      "development" ||
    environment.NODE_ENV === "test"
  ) {
    const registry =
      loadDevelopmentInvitationFixtures({
        runtimeEnvironment:
          environment.NODE_ENV,
      });

    return createDevelopmentStore({
      invitations:
        registry.fixtures,
    });
  }

  if (
    environment.NODE_ENV ===
    "production"
  ) {
    const connection =
      createGoogleSheetsConnection({
        spreadsheetId:
          environment
            .GOOGLE_SPREADSHEET_ID,
      });

    return createGoogleSheetsStore({
      sheets:
        connection
          .getSheetsClient(),
      spreadsheetId:
        connection
          .getSpreadsheetId(),
      onOverviewSyncError: () => {
        console.error(
          "RSVP Overview synchronization failed; canonical RSVP storage remains authoritative.",
        );
      },
    });
  }

  return createUnavailableStore();
}

function createDefaultAnalyticsStore(
  environment,
) {
  if (
    environment.NODE_ENV ===
      "development" ||
    environment.NODE_ENV === "test"
  ) {
    return createDevelopmentAnalyticsStore();
  }

  if (
    environment.NODE_ENV ===
      "production" &&
    typeof environment
      .SITE_ANALYTICS_SPREADSHEET_ID ===
      "string" &&
    environment
      .SITE_ANALYTICS_SPREADSHEET_ID
      .trim() !== ""
  ) {
    const connection =
      createGoogleSheetsConnection({
        spreadsheetId:
          environment
            .SITE_ANALYTICS_SPREADSHEET_ID,
      });

    return createGoogleSheetsAnalyticsStore({
      sheets:
        connection
          .getSheetsClient(),
      spreadsheetId:
        connection
          .getSpreadsheetId(),
    });
  }

  return createUnavailableAnalyticsStore();
}

function createInvitationSourceFromStore(
  rsvpStore,
) {
  return Object.freeze({
    async findByCanonicalCode(
      canonicalCode,
    ) {
      return rsvpStore
        .findInvitationByCanonicalCode(
          canonicalCode,
        );
    },
  });
}

function createApp({
  environment,
  invitationSource,
  rsvpStore,
  analyticsStore,
  deliveryService,
  emailTransport,
  questions,
  now,
  rateLimitNow,
  logger,
  auditNow,
  createCorrelationId,
} = {}) {
  if (!environment) {
    throw new Error(
      "createApp requires validated server environment configuration.",
    );
  }

  const app = express();

  app.set(
    "trust proxy",
    parseTrustProxySetting(
      environment.TRUST_PROXY,
    ),
  );

  app.use(helmet());

  const effectiveLogger =
    logger === undefined &&
    environment.NODE_ENV ===
      "production"
      ? createProductionConsoleLogger()
      : logger;

  if (effectiveLogger) {
    const requestAuditOptions = {
      logger:
        effectiveLogger,
      now: auditNow,
      createCorrelationId,
    };

    /*
     * Anonymous analytics is intentionally excluded from
     * per-request application auditing. The analytics endpoint
     * persists only page-level aggregate counters.
     */
    app.use(
      "/wedding/api/rsvp",
      createSafeRequestAudit(
        requestAuditOptions,
      ),
    );

    app.use(
      "/wedding/api/health",
      createSafeRequestAudit(
        requestAuditOptions,
      ),
    );
  }

  app.use(
    "/wedding/api/rsvp",
    rsvpNoStore,
    createRsvpOriginGuard({
      environment,
    }),
  );

  app.use(
    "/wedding/api/analytics",
    rsvpNoStore,
    createAnalyticsOriginGuard({
      environment,
    }),
    express.json({
      limit: "1kb",
    }),
  );

  app.use(
    "/wedding/api/analytics",
    (
      error,
      req,
      res,
      next,
    ) => {
      if (
        error &&
        (
          error.type ===
            "entity.parse.failed" ||
          error.type ===
            "entity.too.large"
        )
      ) {
        return res
          .status(400)
          .end();
      }

      return next(error);
    },
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
        const response =
          req.path === "/submit"
            ? INVALID_SUBMISSION_RESPONSE
            : INVALID_INVITATION_RESPONSE;

        return res
          .status(400)
          .json(response);
      }

      return next(error);
    },
  );

  const rsvpRateLimiters =
    createRsvpRateLimiters({
      now: rateLimitNow,
    });

  app.post(
    "/wedding/api/rsvp/lookup",
    rsvpRateLimiters.lookupByIp,
  );

  app.post(
    "/wedding/api/rsvp/submit",
    rsvpRateLimiters.submissionByIp,
    rsvpRateLimiters
      .submissionByInvitation,
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

  const effectiveRsvpStore =
    rsvpStore ||
    createDefaultRsvpStore(
      environment,
    );

  const effectiveAnalyticsStore =
    analyticsStore ||
    createDefaultAnalyticsStore(
      environment,
    );

  const effectiveInvitationSource =
    invitationSource ||
    createInvitationSourceFromStore(
      effectiveRsvpStore,
    );

  const invitationService =
    createInvitationService({
      runtimeEnvironment:
        environment.NODE_ENV,
      invitationSource:
        effectiveInvitationSource,
    });

  const effectiveQuestions =
    questions === undefined
      ? loadReusableRsvpQuestions()
      : questions;

  const effectiveDeliveryService =
    createConfiguredDeliveryService({
      environment,
      deliveryService,
      emailTransport,
    });

  const submissionService =
    createRsvpSubmissionService({
      invitationService,
      rsvpStore:
        effectiveRsvpStore,
      deliveryService:
        effectiveDeliveryService,
      environment,
      now,
    });

  app.use(
    "/wedding/api/analytics",
    createAnalyticsRouter({
      analyticsStore:
        effectiveAnalyticsStore,
      now: rateLimitNow,
    }),
  );

  app.use(
    "/wedding/api/rsvp",
    createRsvpRouter({
      invitationService,
      submissionService,
      environment,
      questions:
        effectiveQuestions,
      now,
    }),
  );

  app.use(
    "/wedding/api/rsvp",
    (
      error,
      req,
      res,
      next,
    ) => {
      if (res.headersSent) {
        return next(error);
      }

      return res
        .status(503)
        .json(
          SERVICE_UNAVAILABLE_RESPONSE,
        );
    },
  );

  return app;
}

module.exports = {
  createApp,
};
