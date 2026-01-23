import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { SocketProvider } from "./context/SocketContext";
import { GameContextProvider } from "./context/GameContext";
import { SoundContextProvider } from "./context/SoundContext";
import { MultiplayerContextProvider } from "./context/MultiplayerContext";
import App from "./App";
import { HashRouter as BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
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
      </SocketProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
