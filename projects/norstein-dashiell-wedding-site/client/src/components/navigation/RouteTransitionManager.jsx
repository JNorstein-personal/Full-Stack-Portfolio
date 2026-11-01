import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import howlCalcifer from "../../assets/images/HowlCalcifer.gif";

const MINIMUM_LOADING_TIME_MS = 650;
const MAXIMUM_LOADING_TIME_MS = 8000;

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function waitForNextPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
}

function waitForImage(image, signal) {
  if (image.complete) {
    return typeof image.decode === "function"
      ? image.decode().catch(() => {})
      : Promise.resolve();
  }

  image.loading = "eager";

  return new Promise((resolve) => {
    const finish = () => {
      if (
        !image.complete ||
        typeof image.decode !== "function"
      ) {
        resolve();
        return;
      }

      image.decode().catch(() => {}).finally(resolve);
    };

    image.addEventListener("load", finish, {
      once: true,
      signal,
    });

    image.addEventListener("error", resolve, {
      once: true,
      signal,
    });
  });
}

function waitForVideoMetadata(video, signal) {
  if (video.readyState >= 1) {
    return Promise.resolve();
  }

  if (video.preload === "none") {
    video.preload = "metadata";
  }

  return new Promise((resolve) => {
    video.addEventListener(
      "loadedmetadata",
      resolve,
      {
        once: true,
        signal,
      },
    );

    video.addEventListener("error", resolve, {
      once: true,
      signal,
    });

    video.load();
  });
}

function waitForIframe(iframe, signal) {
  /*
   * Cross-origin iframe contents cannot be inspected directly.
   * For route transitions we only need the iframe document shell
   * loaded; video/audio inside the player may continue buffering
   * normally after the page is revealed.
   */
  iframe.loading = "eager";

  return new Promise((resolve) => {
    iframe.addEventListener("load", resolve, {
      once: true,
      signal,
    });

    iframe.addEventListener("error", resolve, {
      once: true,
      signal,
    });
  });
}

async function waitForPageAssets(signal) {
  await waitForNextPaint();

  if (signal.aborted) {
    return;
  }

  const mainContent =
    document.getElementById("main-content");

  if (!mainContent) {
    return;
  }

  const readinessTasks = [];

  if (document.fonts?.ready) {
    readinessTasks.push(
      document.fonts.ready.catch(() => {}),
    );
  }

  for (const image of mainContent.querySelectorAll(
    "img",
  )) {
    readinessTasks.push(
      waitForImage(image, signal),
    );
  }

  for (const video of mainContent.querySelectorAll(
    "video",
  )) {
    readinessTasks.push(
      waitForVideoMetadata(video, signal),
    );
  }

  for (const iframe of mainContent.querySelectorAll(
    "iframe",
  )) {
    readinessTasks.push(
      waitForIframe(iframe, signal),
    );
  }

  await Promise.allSettled(readinessTasks);
}

function RouteTransitionManager() {
  const location = useLocation();
  const previousLocationRef = useRef(null);
  const transitionIdRef = useRef(0);

  const [isLoading, setIsLoading] =
    useState(true);

  useLayoutEffect(() => {
    const previousLocation =
      previousLocationRef.current;

    const currentLocation = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      key: location.key,
    };

    const isHashOnlyNavigation =
      previousLocation &&
      previousLocation.pathname ===
        currentLocation.pathname &&
      previousLocation.search ===
        currentLocation.search &&
      previousLocation.hash !==
        currentLocation.hash;

    previousLocationRef.current =
      currentLocation;

    if (isHashOnlyNavigation) {
      return undefined;
    }

    const transitionId =
      transitionIdRef.current + 1;

    transitionIdRef.current = transitionId;

    const abortController =
      new AbortController();

    const startedAt = performance.now();

    setIsLoading(true);
    document.body.classList.add(
      "route-transition-active",
    );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    async function completeTransition() {
      try {
        await Promise.race([
          waitForPageAssets(
            abortController.signal,
          ),
          wait(MAXIMUM_LOADING_TIME_MS),
        ]);

        const elapsed =
          performance.now() - startedAt;

        if (
          elapsed <
          MINIMUM_LOADING_TIME_MS
        ) {
          await wait(
            MINIMUM_LOADING_TIME_MS -
              elapsed,
          );
        }
      } finally {
        if (
          abortController.signal.aborted ||
          transitionIdRef.current !==
            transitionId
        ) {
          return;
        }

        setIsLoading(false);

        document.body.classList.remove(
          "route-transition-active",
        );

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      }
    }

    void completeTransition();

    return () => {
      abortController.abort();

      if (
        transitionIdRef.current ===
        transitionId
      ) {
        document.body.classList.remove(
          "route-transition-active",
        );
      }
    };
  }, [
    location.hash,
    location.key,
    location.pathname,
    location.search,
  ]);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="route-loading-screen"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="route-loading-screen__content">
        <img
          className="route-loading-screen__image"
          src={howlCalcifer}
          alt=""
          aria-hidden="true"
        />

        <p className="route-loading-screen__title">
          Loading…
        </p>

        <p className="route-loading-screen__message">
          Please wait while we prepare this page.
        </p>
      </div>
    </div>
  );
}

export default RouteTransitionManager;
