import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { GameContextProvider } from "./context/GameContext";
import { SoundContextProvider } from "./context/SoundContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SoundContextProvider>
      <GameContextProvider>
        <App />
      </GameContextProvider>
    </SoundContextProvider>
  </React.StrictMode>
);
