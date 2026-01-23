import { create } from "zustand";
import { Howl } from "howler";
import moveSound from "../assets/sounds/move.mp3";
import captureSound from "../assets/sounds/capture.mp3";

interface SoundState {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  playMoveSound: () => void;
  playCaptureSound: () => void;
}

export const useSoundStore = create<SoundState>((set, get) => ({
  isSoundEnabled: false,

  setIsSoundEnabled: (enabled) => set({ isSoundEnabled: enabled }),
  toggleSound: () =>
    set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

  playMoveSound: () => {
    const { isSoundEnabled } = get();
    if (!isSoundEnabled) return;

    const sound = new Howl({
      src: [moveSound],
    });
    sound.play();
  },

  playCaptureSound: () => {
    const { isSoundEnabled } = get();
    if (!isSoundEnabled) return;

    const sound = new Howl({
      src: [captureSound],
    });
    sound.play();
  },
}));
