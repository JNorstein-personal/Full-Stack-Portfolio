const ANALYTICS_PAGE_PATHS =
  Object.freeze([
    "/wedding/",
    "/wedding/rsvp",
    "/wedding/rsvp/confirmation",
    "/wedding/theme",
    "/wedding/story",
    "/wedding/read-listen-watch",
    "/wedding/venue",
    "/wedding/travel",
    "/wedding/day-of",
    "/wedding/faq",
    "/wedding/gallery",
    "/wedding/privacy",
  ]);

const ANALYTICS_PAGE_PATH_SET =
  new Set(
    ANALYTICS_PAGE_PATHS,
  );

function normalizeAnalyticsPath(
  pathname,
) {
  if (
    typeof pathname !== "string" ||
    pathname === "" ||
    pathname.includes("?") ||
    pathname.includes("#")
  ) {
    return null;
  }

  let normalized = pathname;

  if (
    normalized === "/wedding" ||
    normalized === "/wedding/"
  ) {
    normalized = "/wedding/";
  } else {
    normalized =
      normalized.replace(
        /\/+$/,
        "",
      );
  }

  return ANALYTICS_PAGE_PATH_SET.has(
    normalized,
  )
    ? normalized
    : null;
}

module.exports = {
  ANALYTICS_PAGE_PATHS,
  normalizeAnalyticsPath,
};
