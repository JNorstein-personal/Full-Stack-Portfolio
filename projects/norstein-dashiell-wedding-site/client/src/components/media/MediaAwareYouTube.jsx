import {
  useEffect,
  useRef,
} from "react";

import { useBackgroundMusic } from "./BackgroundMusicContext";

let youtubeApiPromise = null;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise(
    (resolve, reject) => {
      const existingReadyHandler =
        window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady =
        function handleYouTubeIframeApiReady() {
          if (
            typeof existingReadyHandler ===
            "function"
          ) {
            existingReadyHandler();
          }

          if (window.YT?.Player) {
            resolve(window.YT);
            return;
          }

          reject(
            new Error(
              "YouTube IFrame Player API did not initialize.",
            ),
          );
        };

      let script = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      );

      if (!script) {
        script =
          document.createElement("script");
        script.src =
          "https://www.youtube.com/iframe_api";
        script.async = true;

        const firstScript =
          document.getElementsByTagName(
            "script",
          )[0];

        if (firstScript?.parentNode) {
          firstScript.parentNode.insertBefore(
            script,
            firstScript,
          );
        } else {
          document.head.appendChild(script);
        }
      }

      script.addEventListener(
        "error",
        () => {
          youtubeApiPromise = null;

          reject(
            new Error(
              "YouTube IFrame Player API could not be loaded.",
            ),
          );
        },
        { once: true },
      );
    },
  );

  return youtubeApiPromise;
}

function MediaAwareYouTube({
  videoId,
  mediaId,
  title,
}) {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  const {
    registerForegroundPlayback,
    unregisterForegroundPlayback,
  } = useBackgroundMusic();

  useEffect(() => {
    let isCancelled = false;

    async function initializePlayer() {
      try {
        const YT =
          await loadYouTubeIframeApi();

        if (
          isCancelled ||
          !iframeRef.current
        ) {
          return;
        }

        const player = new YT.Player(
          iframeRef.current,
          {
            events: {
              onStateChange(event) {
                if (
                  event.data ===
                  YT.PlayerState.PLAYING
                ) {
                  registerForegroundPlayback(
                    mediaId,
                  );
                  return;
                }

                if (
                  event.data ===
                    YT.PlayerState.PAUSED ||
                  event.data ===
                    YT.PlayerState.ENDED ||
                  event.data ===
                    YT.PlayerState.CUED ||
                  event.data ===
                    YT.PlayerState.UNSTARTED
                ) {
                  unregisterForegroundPlayback(
                    mediaId,
                  );
                }
              },
              onError() {
                unregisterForegroundPlayback(
                  mediaId,
                );
              },
            },
          },
        );

        playerRef.current = player;
      } catch {
        unregisterForegroundPlayback(
          mediaId,
        );
      }
    }

    void initializePlayer();

    return () => {
      isCancelled = true;

      unregisterForegroundPlayback(mediaId);

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // The iframe may already have been removed.
        }

        playerRef.current = null;
      }
    };
  }, [
    mediaId,
    registerForegroundPlayback,
    unregisterForegroundPlayback,
  ]);

  return (
    <iframe
      ref={iframeRef}
      src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1&rel=0`}
      title={title}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        border: 0,
      }}
    />
  );
}

export default MediaAwareYouTube;
