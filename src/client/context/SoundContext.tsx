import { createContext, useEffect, useState } from "react";
import { Howl } from "howler";
import menuMusic from "../assets/sounds/menu.mp3";

type SoundContextType = {
  isSoundEnabled: boolean;
  setIsSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  playSound: (soundUrl: string) => void;
};

export const SoundContext = createContext<SoundContextType>({
  playSound: (soundUrl: string) => {},
  isSoundEnabled: false,
  setIsSoundEnabled: () => {},
});

type SoundProviderProps = {
  children: React.ReactNode;
};

export const SoundContextProvider = ({ children }: SoundProviderProps) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    let menuMusicSound: Howl | null = null;

    if (isSoundEnabled) {
      menuMusicSound = new Howl({
        src: [menuMusic],
        loop: true,
      });
      menuMusicSound.play();
    }

    return () => {
      if (menuMusicSound) {
        menuMusicSound.stop();
      }
    };
  }, [isSoundEnabled]);

  const playSound = (soundUrl: string) => {
    const sound = new Howl({
      src: [soundUrl],
    });

    sound.play();
  };

  return (
    <SoundContext.Provider
      value={{ playSound, isSoundEnabled, setIsSoundEnabled }}
    >
      {children}
    </SoundContext.Provider>
  );
};
