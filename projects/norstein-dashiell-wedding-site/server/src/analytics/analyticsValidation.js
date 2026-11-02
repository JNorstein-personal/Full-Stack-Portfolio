const {
  normalizeAnalyticsPath,
} = require(
  "./analyticsPaths",
);

const ALLOWED_KEYS =
  new Set([
    "pagePath",
    "viewDelta",
    "visitorDelta",
    "engagementMs",
  ]);

function isBinaryDelta(value) {
  return value === 0 || value === 1;
}

function parseAnalyticsDelta(
  value,
) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  const keys =
    Object.keys(value);

  if (
    keys.some(
      (key) =>
        !ALLOWED_KEYS.has(key),
    )
  ) {
    return null;
  }

  const pagePath =
    normalizeAnalyticsPath(
      value.pagePath,
    );

  const viewDelta =
    value.viewDelta;

  const visitorDelta =
    value.visitorDelta;

  const engagementMs =
    value.engagementMs;

  if (
    !pagePath ||
    !isBinaryDelta(viewDelta) ||
    !isBinaryDelta(visitorDelta) ||
    visitorDelta > viewDelta ||
    !Number.isInteger(
      engagementMs,
    ) ||
    engagementMs < 0 ||
    engagementMs > 300000 ||
    (
      viewDelta === 0 &&
      visitorDelta === 0 &&
      engagementMs === 0
    )
  ) {
    return null;
  }

  return Object.freeze({
    pagePath,
    viewDelta,
    visitorDelta,
    engagementMs,
  });
}

module.exports = {
  parseAnalyticsDelta,
};
