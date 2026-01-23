import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { SocketProvider } from "./context/SocketContext";
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
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </SocketProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
