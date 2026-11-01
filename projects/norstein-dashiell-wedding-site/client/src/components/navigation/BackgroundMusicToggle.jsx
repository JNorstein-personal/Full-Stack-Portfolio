import { useBackgroundMusic } from "../media/BackgroundMusicProvider";

function BackgroundMusicToggle() {
  const {
    isEnabled,
    isLoading,
    errorMessage,
    toggleMusic,
  } = useBackgroundMusic();

  const accessibleLabel = isLoading
    ? "Starting background music"
    : isEnabled
      ? "Turn background music off"
      : "Turn background music on";

  return (
    <button
      className="background-music-toggle"
      type="button"
      role="switch"
      aria-checked={isEnabled}
      aria-busy={isLoading}
      aria-label={accessibleLabel}
      disabled={isLoading}
      title={errorMessage || accessibleLabel}
      onClick={() => {
        void toggleMusic();
      }}
    >
      <span className="background-music-toggle__label">
        Music
      </span>

      <span
        className="background-music-toggle__track"
        aria-hidden="true"
      >
        <span className="background-music-toggle__thumb" />
      </span>

      <span
        className="background-music-toggle__announcement"
        aria-live="polite"
      >
        {errorMessage}
      </span>
    </button>
  );
}

export default BackgroundMusicToggle;