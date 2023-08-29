import { useEffect, useState } from "react";
import Board from "./components/Board";
import Menu from "./pages/Menu";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/game" element={<Board />} />
    </Routes>
  );
}

export default App;
