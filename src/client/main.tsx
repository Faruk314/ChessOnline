import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext";
import { GameContextProvider } from "./context/GameContext";
import { SoundContextProvider } from "./context/SoundContext";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SoundContextProvider>
        <GameContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GameContextProvider>
      </SoundContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
