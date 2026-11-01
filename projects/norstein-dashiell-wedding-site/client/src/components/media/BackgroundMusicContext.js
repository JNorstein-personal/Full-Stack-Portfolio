import {
  createContext,
  useContext,
} from "react";

export const BackgroundMusicContext =
  createContext(null);

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