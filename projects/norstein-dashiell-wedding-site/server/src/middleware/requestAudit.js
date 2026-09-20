const {
  randomUUID,
} = require("node:crypto");

function classifyEndpoint(req) {
  const path =
    req.originalUrl
      ?.split("?")[0] || "";

  if (
    req.method === "POST" &&
    path ===
      "/wedding/api/rsvp/lookup"
  ) {
    return "rsvp_lookup";
  }

  if (
    req.method === "POST" &&
    path ===
      "/wedding/api/rsvp/submit"
  ) {
    return "rsvp_submit";
  }

  if (
    req.method === "GET" &&
    path ===
      "/wedding/api/health"
  ) {
    return "api_health";
  }

  return "api_other";
}

function createSafeRequestAudit({
  logger,
  now = () => Date.now(),
  createCorrelationId =
    randomUUID,
} = {}) {
  if (
    !logger ||
    typeof logger.info !==
      "function"
  ) {
    throw new Error(
      "Safe request audit requires a logger with an info method.",
    );
  }

  return function safeRequestAudit(
    req,
    res,
    next,
  ) {
    const startedAt =
      Number(now());

    const correlationId =
      createCorrelationId();

    res.on(
      "finish",
      () => {
        const finishedAt =
          Number(now());

        const entry =
          Object.freeze({
            correlationId,
            timestamp:
              new Date(
                startedAt,
              ).toISOString(),
            endpointCategory:
              classifyEndpoint(req),
            httpStatus:
              res.statusCode,
            durationMs:
              Math.max(
                0,
                finishedAt -
                  startedAt,
              ),
          });

        try {
          logger.info(entry);
        } catch {
          // Logging must not alter RSVP behavior.
        }
      },
    );

    next();
  };
}

function createProductionConsoleLogger() {
  return Object.freeze({
    info(entry) {
      console.info(
        JSON.stringify(entry),
      );
    },
  });
}

module.exports = {
  classifyEndpoint,
  createProductionConsoleLogger,
  createSafeRequestAudit,
};
