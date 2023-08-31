import { useContext, useEffect, useState } from "react";
import Board from "./components/Board";
import Menu from "./pages/Menu";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import axios from "axios";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import { SocketContext } from "./context/SocketContext";

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = process.env.FRONTEND_URL;

function App() {
  const { socket } = useContext(SocketContext);
  const { setIsLoggedIn, setLoggedUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/getLoginStatus"
        );

        setIsLoggedIn(response.data.status);
        setLoggedUserInfo(response.data.userInfo);
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false);
      }
    };

    getLoginStatus();
  }, []);

  useEffect(() => {
    socket?.on("gameStart", (gameId) => {
      navigate("/game");
    });

    return () => {
      socket?.off("gameStart");
    };
  }, [socket, navigate]);

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
