const ORIGIN_FORBIDDEN_RESPONSE =
  Object.freeze({
    error:
      "Request origin is not permitted.",
  });

function createRsvpOriginGuard({
  environment,
} = {}) {
  if (!environment) {
    throw new Error(
      "RSVP origin guard requires environment configuration.",
    );
  }

  const production =
    environment.NODE_ENV ===
    "production";
  const allowedOrigin =
    environment.ALLOWED_ORIGIN;

  return function rsvpOriginGuard(
    req,
    res,
    next,
  ) {
    if (!production) {
      return next();
    }

    const origin =
      req.get("origin");

    if (
      origin &&
      origin !== allowedOrigin
    ) {
      res.set(
        "Cache-Control",
        "no-store, max-age=0",
      );

      return res
        .status(403)
        .json(
          ORIGIN_FORBIDDEN_RESPONSE,
        );
    }

    return next();
  };
}

module.exports = {
  ORIGIN_FORBIDDEN_RESPONSE,
  createRsvpOriginGuard,
};
