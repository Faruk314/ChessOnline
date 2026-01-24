import { create } from "zustand";
import { Howl } from "howler";
import moveSound from "../assets/sounds/move.mp3";
import captureSound from "../assets/sounds/capture.mp3";
import checkSound from "../assets/sounds/check.mp3";
import checkmateSound from "../assets/sounds/checkmate.mp3";
import promotionSound from "../assets/sounds/promote.mp3";
import castlingSound from "../assets/sounds/castle.mp3";

interface SoundState {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  playMoveSound: () => void;
  playCaptureSound: () => void;
  playCheckSound: () => void;
  playCheckmateSound: () => void;
  playPromotionSound: () => void;
  playCastlingSound: () => void;
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

  playCheckSound: () => {
    const { isSoundEnabled } = get();
    if (!isSoundEnabled) return;

    const sound = new Howl({
      src: [checkSound],
    });
    sound.play();
  },

  playCheckmateSound: () => {
    const { isSoundEnabled } = get();
    if (!isSoundEnabled) return;

    const sound = new Howl({
      src: [checkmateSound],
    });
    sound.play();
  },

  playPromotionSound: () => {
    const { isSoundEnabled } = get();
    if (!isSoundEnabled) return;

    const sound = new Howl({
      src: [promotionSound],
    });
    sound.play();
  },

  playCastlingSound: () => {
    const { isSoundEnabled } = get();
    if (!isSoundEnabled) return;

    const sound = new Howl({
      src: [castlingSound],
    });
    sound.play();
  },
}));
