import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";
import { GameContextProvider } from "./context/GameContext";
import { SoundContextProvider } from "./context/SoundContext";
import { MultiplayerContextProvider } from "./context/MultiplayerContext";
import { FriendContextProvider } from "./context/FriendContext";
import App from "./App";
import { HashRouter as BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <FriendContextProvider>
          <SoundContextProvider>
            <GameContextProvider>
              <MultiplayerContextProvider>
                <BrowserRouter>
                  <App />
                  <ToastContainer />
                </BrowserRouter>
              </MultiplayerContextProvider>
            </GameContextProvider>
          </SoundContextProvider>
        </FriendContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
