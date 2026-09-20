const {
  normalizeInvitationCode,
} = require("../rsvp/invitationCode");

const RSVP_RATE_LIMIT_WINDOW_MS =
  15 * 60 * 1000;

const LOOKUP_REQUEST_LIMIT = 10;
const SUBMISSION_REQUEST_LIMIT = 6;

const RATE_LIMITED_RESPONSE =
  Object.freeze({
    error: Object.freeze({
      code: "RATE_LIMITED",
      message:
        "Too many RSVP requests. Please wait and try again.",
    }),
  });

function defaultNow() {
  return Date.now();
}

function clientIpKey(req) {
  return (
    req.ip ||
    req.socket?.remoteAddress ||
    "unknown-client"
  );
}

function normalizedInvitationKey(
  req,
) {
  const normalized =
    normalizeInvitationCode(
      req.body?.inviteCode,
    );

  return normalized
    ? normalized.canonicalCode
    : null;
}

function createRollingWindowLimiter({
  limit,
  windowMs =
    RSVP_RATE_LIMIT_WINDOW_MS,
  keyGenerator,
  now = defaultNow,
} = {}) {
  if (
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    throw new Error(
      "Rolling-window limiter requires a positive integer limit.",
    );
  }

  if (
    !Number.isFinite(windowMs) ||
    windowMs < 1
  ) {
    throw new Error(
      "Rolling-window limiter requires a positive window.",
    );
  }

  if (
    typeof keyGenerator !==
    "function"
  ) {
    throw new Error(
      "Rolling-window limiter requires a key generator.",
    );
  }

  const timestampsByKey =
    new Map();

  return function rollingWindowLimiter(
    req,
    res,
    next,
  ) {
    const key =
      keyGenerator(req);

    if (
      key === null ||
      key === undefined ||
      key === ""
    ) {
      next();
      return;
    }

    const current =
      Number(now());

    if (
      !Number.isFinite(current)
    ) {
      next(
        new Error(
          "Rate-limit clock returned an invalid value.",
        ),
      );
      return;
    }

    const cutoff =
      current - windowMs;

    const active =
      (
        timestampsByKey.get(key) ||
        []
      ).filter(
        (timestamp) =>
          timestamp > cutoff,
      );

    if (active.length >= limit) {
      const retryAfterMs =
        Math.max(
          1,
          active[0] +
            windowMs -
            current,
        );

      res.set(
        "Retry-After",
        String(
          Math.max(
            1,
            Math.ceil(
              retryAfterMs /
                1000,
            ),
          ),
        ),
      );

      res
        .status(429)
        .json(
          RATE_LIMITED_RESPONSE,
        );
      return;
    }

    active.push(current);
    timestampsByKey.set(
      key,
      active,
    );

    next();
  };
}

function createRsvpRateLimiters({
  now,
} = {}) {
  return Object.freeze({
    lookupByIp:
      createRollingWindowLimiter({
        limit:
          LOOKUP_REQUEST_LIMIT,
        keyGenerator:
          clientIpKey,
        now,
      }),

    submissionByIp:
      createRollingWindowLimiter({
        limit:
          SUBMISSION_REQUEST_LIMIT,
        keyGenerator:
          clientIpKey,
        now,
      }),

    submissionByInvitation:
      createRollingWindowLimiter({
        limit:
          SUBMISSION_REQUEST_LIMIT,
        keyGenerator:
          normalizedInvitationKey,
        now,
      }),
  });
}

module.exports = {
  LOOKUP_REQUEST_LIMIT,
  RATE_LIMITED_RESPONSE,
  RSVP_RATE_LIMIT_WINDOW_MS,
  SUBMISSION_REQUEST_LIMIT,
  clientIpKey,
  createRollingWindowLimiter,
  createRsvpRateLimiters,
  normalizedInvitationKey,
};
