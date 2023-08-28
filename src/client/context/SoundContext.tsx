import { createContext } from "react";
import { Howl } from "howler";

type SoundContextType = {
  playSound: (soundUrl: string) => void;
};

export const SoundContext = createContext<SoundContextType>({
  playSound: (soundUrl: string) => {},
});

type SoundProviderProps = {
  children: React.ReactNode;
};

export const SoundContextProvider = ({ children }: SoundProviderProps) => {
  const playSound = (soundUrl: string) => {
    const sound = new Howl({
      src: [soundUrl],
    });

    sound.play();
  };

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
};
