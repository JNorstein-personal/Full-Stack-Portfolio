const express = require("express");

const {
  parseAnalyticsDelta,
} = require(
  "../analytics/analyticsValidation",
);

function createAnalyticsOriginGuard({
  environment,
} = {}) {
  if (!environment) {
    throw new Error(
      "Analytics origin guard requires environment configuration.",
    );
  }

  return function analyticsOriginGuard(
    req,
    res,
    next,
  ) {
    const origin =
      req.get("origin");

    if (
      origin &&
      origin !==
        environment.ALLOWED_ORIGIN
    ) {
      return res
        .status(403)
        .end();
    }

    return next();
  };
}

function createAggregateRateLimiter({
  now = () => Date.now(),
  limit = 240,
  windowMs = 60000,
} = {}) {
  let windowStartedAt =
    now();

  let requestCount = 0;

  return function aggregateRateLimit(
    req,
    res,
    next,
  ) {
    const current =
      now();

    if (
      current - windowStartedAt >=
      windowMs
    ) {
      windowStartedAt =
        current;
      requestCount = 0;
    }

    if (
      requestCount >= limit
    ) {
      return res
        .status(429)
        .end();
    }

    requestCount += 1;

    return next();
  };
}

function createAnalyticsRouter({
  analyticsStore,
  now,
} = {}) {
  if (
    !analyticsStore ||
    typeof analyticsStore
      .applyDelta !==
      "function"
  ) {
    throw new Error(
      "Analytics router requires an analytics store.",
    );
  }

  const router =
    express.Router();

  const aggregateRateLimit =
    createAggregateRateLimiter({
      now,
    });

  router.post(
    "/",
    aggregateRateLimit,
    async (req, res) => {
      const delta =
        parseAnalyticsDelta(
          req.body,
        );

      if (!delta) {
        return res
          .status(400)
          .end();
      }

      try {
        await analyticsStore
          .applyDelta(delta);

        return res
          .status(204)
          .end();
      } catch {
        return res
          .status(503)
          .end();
      }
    },
  );

  return router;
}

module.exports = {
  createAggregateRateLimiter,
  createAnalyticsOriginGuard,
  createAnalyticsRouter,
};
