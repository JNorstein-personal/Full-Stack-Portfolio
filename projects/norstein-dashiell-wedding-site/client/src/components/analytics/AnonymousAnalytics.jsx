import {
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";

import {
  hasSeenAnalyticsPage,
  markAnalyticsPageSeen,
  normalizeAnalyticsPath,
  sendAnonymousAnalyticsDelta,
} from "../../services/anonymousAnalytics.js";

const ENGAGEMENT_HEARTBEAT_MS = 60000;
const MINIMUM_ENGAGEMENT_SEND_MS = 1000;
const STRICT_MODE_DUPLICATE_WINDOW_MS = 2000;

const recentPageViews = new Map();

function shouldSendPageView(
  pagePath,
) {
  const now = performance.now();
  const previous =
    recentPageViews.get(pagePath);

  recentPageViews.set(
    pagePath,
    now,
  );

  for (
    const [
      candidatePath,
      recordedAt,
    ] of recentPageViews
  ) {
    if (
      now - recordedAt >
      STRICT_MODE_DUPLICATE_WINDOW_MS
    ) {
      recentPageViews.delete(
        candidatePath,
      );
    }
  }

  return (
    previous === undefined ||
    now - previous >
      STRICT_MODE_DUPLICATE_WINDOW_MS
  );
}

function isActivelyEngaged() {
  return (
    document.visibilityState ===
      "visible" &&
    document.hasFocus()
  );
}

function AnonymousAnalytics() {
  const location = useLocation();

  const pagePath =
    normalizeAnalyticsPath(
      window.location.pathname,
    );

  useEffect(() => {
    if (
      !pagePath ||
      !shouldSendPageView(pagePath)
    ) {
      return;
    }

    const firstBrowserView =
      !hasSeenAnalyticsPage(
        pagePath,
      );

    void sendAnonymousAnalyticsDelta({
      pagePath,
      viewDelta: 1,
      visitorDelta:
        firstBrowserView ? 1 : 0,
      engagementMs: 0,
    }).then((recorded) => {
      if (
        recorded &&
        firstBrowserView
      ) {
        markAnalyticsPageSeen(
          pagePath,
        );
      }
    });
  }, [pagePath]);

  useEffect(() => {
    if (!pagePath) {
      return undefined;
    }

    let activeStartedAt =
      isActivelyEngaged()
        ? performance.now()
        : null;

    let pendingEngagementMs = 0;

    function pauseEngagement() {
      if (
        activeStartedAt === null
      ) {
        return;
      }

      pendingEngagementMs +=
        performance.now() -
        activeStartedAt;

      activeStartedAt = null;
    }

    function resumeEngagement() {
      if (
        activeStartedAt === null &&
        isActivelyEngaged()
      ) {
        activeStartedAt =
          performance.now();
      }
    }

    function collectActiveTime() {
      if (
        activeStartedAt === null
      ) {
        return;
      }

      const now =
        performance.now();

      pendingEngagementMs +=
        now - activeStartedAt;

      activeStartedAt = now;
    }

    function flushEngagement(
      keepalive = false,
    ) {
      collectActiveTime();

      const engagementMs =
        Math.min(
          300000,
          Math.floor(
            pendingEngagementMs,
          ),
        );

      if (
        engagementMs <
        MINIMUM_ENGAGEMENT_SEND_MS
      ) {
        return;
      }

      pendingEngagementMs -=
        engagementMs;

      void sendAnonymousAnalyticsDelta(
        {
          pagePath,
          viewDelta: 0,
          visitorDelta: 0,
          engagementMs,
        },
        {
          keepalive,
        },
      );
    }

    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        "hidden"
      ) {
        pauseEngagement();
        flushEngagement(true);
      } else {
        resumeEngagement();
      }
    }

    function handleFocus() {
      resumeEngagement();
    }

    function handleBlur() {
      pauseEngagement();
      flushEngagement(true);
    }

    function handlePageHide() {
      pauseEngagement();
      flushEngagement(true);
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    window.addEventListener(
      "focus",
      handleFocus,
    );

    window.addEventListener(
      "blur",
      handleBlur,
    );

    window.addEventListener(
      "pagehide",
      handlePageHide,
    );

    const heartbeat =
      window.setInterval(
        () => {
          flushEngagement(false);
        },
        ENGAGEMENT_HEARTBEAT_MS,
      );

    return () => {
      window.clearInterval(
        heartbeat,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.removeEventListener(
        "focus",
        handleFocus,
      );

      window.removeEventListener(
        "blur",
        handleBlur,
      );

      window.removeEventListener(
        "pagehide",
        handlePageHide,
      );

      pauseEngagement();
      flushEngagement(true);
    };
  }, [
    location.pathname,
    pagePath,
  ]);

  return null;
}

export default AnonymousAnalytics;
