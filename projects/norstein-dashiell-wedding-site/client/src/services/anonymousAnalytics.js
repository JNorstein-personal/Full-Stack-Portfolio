import { buildApiUrl } from "./api.js";

export const ANALYTICS_MARKER_KEY =
  "norstein-dashiell.analytics.seen-pages.v1";

export const ANALYTICS_PAGE_PATHS = Object.freeze([
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
  new Set(ANALYTICS_PAGE_PATHS);

const inMemorySeenPages = new Set();

export function normalizeAnalyticsPath(
  pathname,
) {
  if (
    typeof pathname !== "string" ||
    pathname === ""
  ) {
    return null;
  }

  if (
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
      normalized.replace(/\/+$/, "");
  }

  return ANALYTICS_PAGE_PATH_SET.has(
    normalized,
  )
    ? normalized
    : null;
}

function readStoredSeenPages() {
  if (
    typeof window === "undefined" ||
    !window.localStorage
  ) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        ANALYTICS_MARKER_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value) =>
      ANALYTICS_PAGE_PATH_SET.has(
        value,
      ),
    );
  } catch {
    return [];
  }
}

export function hasSeenAnalyticsPage(
  pagePath,
) {
  const normalized =
    normalizeAnalyticsPath(pagePath);

  if (!normalized) {
    return false;
  }

  if (
    inMemorySeenPages.has(normalized)
  ) {
    return true;
  }

  const stored =
    readStoredSeenPages();

  for (const value of stored) {
    inMemorySeenPages.add(value);
  }

  return inMemorySeenPages.has(
    normalized,
  );
}

export function markAnalyticsPageSeen(
  pagePath,
) {
  const normalized =
    normalizeAnalyticsPath(pagePath);

  if (!normalized) {
    return false;
  }

  inMemorySeenPages.add(normalized);

  if (
    typeof window === "undefined" ||
    !window.localStorage
  ) {
    return true;
  }

  try {
    const stored =
      new Set(readStoredSeenPages());

    stored.add(normalized);

    window.localStorage.setItem(
      ANALYTICS_MARKER_KEY,
      JSON.stringify(
        [...stored].sort(),
      ),
    );
  } catch {
    // The in-memory marker still prevents repeat counting
    // during the current browser runtime.
  }

  return true;
}

function isBinaryDelta(value) {
  return value === 0 || value === 1;
}

export function validateAnalyticsDelta({
  pagePath,
  viewDelta = 0,
  visitorDelta = 0,
  engagementMs = 0,
} = {}) {
  const normalized =
    normalizeAnalyticsPath(pagePath);

  if (
    !normalized ||
    !isBinaryDelta(viewDelta) ||
    !isBinaryDelta(visitorDelta) ||
    visitorDelta > viewDelta ||
    !Number.isInteger(engagementMs) ||
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
    pagePath: normalized,
    viewDelta,
    visitorDelta,
    engagementMs,
  });
}

export async function sendAnonymousAnalyticsDelta(
  delta,
  {
    keepalive = false,
  } = {},
) {
  const payload =
    validateAnalyticsDelta(delta);

  if (!payload) {
    return false;
  }

  try {
    const response = await fetch(
      buildApiUrl("/analytics"),
      {
        method: "POST",
        headers: {
          "content-type":
            "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        keepalive,
      },
    );

    return response.ok;
  } catch {
    return false;
  }
}
