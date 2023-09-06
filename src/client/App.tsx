import { useContext, useEffect, useState } from "react";
import Menu from "./pages/Menu";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import axios from "axios";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import { SocketContext } from "./context/SocketContext";
import Multiplayer from "./pages/Multiplayer";
import SinglePlayer from "./pages/SinglePlayer";
import { GameContext } from "./context/GameContext";
import OpponentLeft from "./modals/OpponentLeft";

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = process.env.FRONTEND_URL;

function App() {
  const { socket } = useContext(SocketContext);
  const { gameId } = useContext(GameContext);
  const { setIsLoggedIn, setLoggedUserInfo, isLoggedIn } =
    useContext(AuthContext);
  const [openOpponentLeft, setOpenOpponentLeft] = useState(false);
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
    socket?.on("connect", () => {
      if (gameId) {
        socket?.emit("reconnectToRoom", gameId);
      }
    });
  }, [gameId, socket, isLoggedIn]);

  useEffect(() => {
    socket?.on("gameStart", () => {
      navigate("/multiplayer");
    });

    return () => {
      socket?.off("gameStart");
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket?.on("opponentResigned", () => {
      setOpenOpponentLeft(true);
      navigate("/menu");
    });

    return () => {
      socket?.off("opponentResigned");
    };
  }, [socket, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
        <Route path="/singlePlayer" element={<SinglePlayer />} />
      </Routes>
      {openOpponentLeft && (
        <OpponentLeft setOpenOpponentLeft={setOpenOpponentLeft} />
      )}
    </div>
  );
}

export default App;
