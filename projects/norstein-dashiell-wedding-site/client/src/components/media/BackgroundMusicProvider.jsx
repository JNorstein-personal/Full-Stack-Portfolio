import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import introMusicUrl from "../../assets/audio/Website Background Music/IntroMerry Go Round.mp3";
import loopMusicUrl from "../../assets/audio/Website Background Music/LoopMerry Go Round.mp3";

const BackgroundMusicContext = createContext(null);

const BACKGROUND_MUSIC_PLAYBACK_RATE = 1.1;

const BACKGROUND_MUSIC_GAIN = .5;
const START_DELAY_SECONDS = 0.06;
const GAIN_SMOOTHING_SECONDS = 0.03;

function getAudioContextConstructor() {
  return window.AudioContext || window.webkitAudioContext;
}

async function loadAudioBuffer(audioContext, sourceUrl) {
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(
      `Unable to load background music (${response.status}).`,
    );
  }

  const encodedAudio = await response.arrayBuffer();

  return audioContext.decodeAudioData(encodedAudio);
}

export function BackgroundMusicProvider({ children }) {
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const introBufferRef = useRef(null);
  const loopBufferRef = useRef(null);
  const introSourceRef = useRef(null);
  const loopSourceRef = useRef(null);
  const activeForegroundMediaRef = useRef(new Set());

  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const applyBackgroundGain = useCallback(() => {
    const audioContext = audioContextRef.current;
    const gainNode = gainNodeRef.current;

    if (!audioContext || !gainNode) {
      return;
    }

    const targetGain =
      activeForegroundMediaRef.current.size > 0
        ? 0
        : BACKGROUND_MUSIC_GAIN;

    const now = audioContext.currentTime;

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setTargetAtTime(
      targetGain,
      now,
      GAIN_SMOOTHING_SECONDS,
    );
  }, []);

  const registerForegroundPlayback = useCallback(
    (mediaId) => {
      if (!mediaId) {
        return;
      }

      activeForegroundMediaRef.current.add(mediaId);
      applyBackgroundGain();
    },
    [applyBackgroundGain],
  );

  const unregisterForegroundPlayback = useCallback(
    (mediaId) => {
      if (!mediaId) {
        return;
      }

      activeForegroundMediaRef.current.delete(mediaId);
      applyBackgroundGain();
    },
    [applyBackgroundGain],
  );

  const stopCurrentSources = useCallback(() => {
    for (const sourceRef of [
      introSourceRef,
      loopSourceRef,
    ]) {
      const source = sourceRef.current;

      if (!source) {
        continue;
      }

      try {
        source.stop();
      } catch {
        // The source may already have ended or been stopped.
      }

      try {
        source.disconnect();
      } catch {
        // A disconnected source requires no further cleanup.
      }

      sourceRef.current = null;
    }
  }, []);

  const ensureAudioResources = useCallback(async () => {
    const AudioContextConstructor =
      getAudioContextConstructor();

    if (!AudioContextConstructor) {
      throw new Error(
        "This browser does not support the Web Audio API.",
      );
    }

    let audioContext = audioContextRef.current;

    if (
      !audioContext ||
      audioContext.state === "closed"
    ) {
      audioContext = new AudioContextConstructor();
      audioContextRef.current = audioContext;

      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNodeRef.current = gainNode;
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    if (
      !introBufferRef.current ||
      !loopBufferRef.current
    ) {
      const [introBuffer, loopBuffer] =
        await Promise.all([
          loadAudioBuffer(
            audioContext,
            introMusicUrl,
          ),
          loadAudioBuffer(
            audioContext,
            loopMusicUrl,
          ),
        ]);

      introBufferRef.current = introBuffer;
      loopBufferRef.current = loopBuffer;
    }

    return audioContext;
  }, []);

  const startMusic = useCallback(async () => {
    if (isEnabled || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const audioContext =
        await ensureAudioResources();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      stopCurrentSources();

      const gainNode = gainNodeRef.current;
      const introBuffer = introBufferRef.current;
      const loopBuffer = loopBufferRef.current;

      if (
        !gainNode ||
        !introBuffer ||
        !loopBuffer
      ) {
        throw new Error(
          "Background music could not be prepared.",
        );
      }

      const targetGain =
        activeForegroundMediaRef.current.size > 0
          ? 0
          : BACKGROUND_MUSIC_GAIN;

      gainNode.gain.cancelScheduledValues(
        audioContext.currentTime,
      );
      gainNode.gain.setValueAtTime(
        targetGain,
        audioContext.currentTime,
      );

      const introSource =
        audioContext.createBufferSource();
      const loopSource =
        audioContext.createBufferSource();

      introSource.buffer = introBuffer;
      loopSource.buffer = loopBuffer;
      loopSource.loop = true;

      introSource.playbackRate.value =
        BACKGROUND_MUSIC_PLAYBACK_RATE;

      loopSource.playbackRate.value =
        BACKGROUND_MUSIC_PLAYBACK_RATE;

      introSource.connect(gainNode);
      loopSource.connect(gainNode);

      const startAt =
        audioContext.currentTime +
        START_DELAY_SECONDS;

      introSource.start(startAt);
      loopSource.start(
        startAt +
          introBuffer.duration /
            BACKGROUND_MUSIC_PLAYBACK_RATE,
      );

      introSourceRef.current = introSource;
      loopSourceRef.current = loopSource;

      introSource.addEventListener(
        "ended",
        () => {
          if (
            introSourceRef.current ===
            introSource
          ) {
            introSourceRef.current = null;
          }
        },
        { once: true },
      );

      setIsEnabled(true);
    } catch (error) {
      stopCurrentSources();
      setIsEnabled(false);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Background music could not be started.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    ensureAudioResources,
    isEnabled,
    isLoading,
    stopCurrentSources,
  ]);

  const stopMusic = useCallback(() => {
    stopCurrentSources();
    setIsEnabled(false);
    setIsLoading(false);
    setErrorMessage("");
  }, [stopCurrentSources]);

  const toggleMusic = useCallback(async () => {
    if (isEnabled) {
      stopMusic();
      return;
    }

    await startMusic();
  }, [isEnabled, startMusic, stopMusic]);

  useEffect(() => {
    return () => {
      stopCurrentSources();

      const audioContext =
        audioContextRef.current;

      if (
        audioContext &&
        audioContext.state !== "closed"
      ) {
        void audioContext.close();
      }
    };
  }, [stopCurrentSources]);

  const contextValue = useMemo(
    () => ({
      isEnabled,
      isLoading,
      errorMessage,
      toggleMusic,
      registerForegroundPlayback,
      unregisterForegroundPlayback,
    }),
    [
      errorMessage,
      isEnabled,
      isLoading,
      registerForegroundPlayback,
      toggleMusic,
      unregisterForegroundPlayback,
    ],
  );

  return (
    <BackgroundMusicContext.Provider
      value={contextValue}
    >
      {children}
    </BackgroundMusicContext.Provider>
  );
}

export function useBackgroundMusic() {
  const context = useContext(
    BackgroundMusicContext,
  );

  if (!context) {
    throw new Error(
      "useBackgroundMusic must be used within BackgroundMusicProvider.",
    );
  }

  return context;
}
