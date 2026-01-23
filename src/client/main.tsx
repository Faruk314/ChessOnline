import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { SocketProvider } from "./context/SocketContext";
import { GameContextProvider } from "./context/GameContext";
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
        <GameContextProvider>
          <BrowserRouter>
            <App />
            <ToastContainer />
          </BrowserRouter>
        </GameContextProvider>
      </SocketProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
