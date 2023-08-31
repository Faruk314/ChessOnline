import { useEffect, useState } from "react";
import Board from "./components/Board";
import Menu from "./pages/Menu";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import axios from "axios";
import Register from "./pages/Register";

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = process.env.FRONTEND_URL;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/game" element={<Board />} />
    </Routes>
  );
}

export default App;
