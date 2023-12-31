import { useContext, useEffect, useState } from "react";
import Menu from "./pages/Menu";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import axios from "axios";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import { SocketContext } from "./context/SocketContext";
import Multiplayer from "./pages/Multiplayer";
import SinglePlayer from "./pages/SinglePlayer";
import { GameContext } from "./context/GameContext";
import OpponentLeft from "./modals/OpponentLeft";
import Draw from "./modals/Draw";
import { UserInfo, UserRequest } from "../types/types";
import { FriendContext } from "./context/FriendContext";
import ProtectedAuthPages from "./protection/ProtectedAuthPages";
import ProtectedRoutes from "./protection/ProtectedRoutes";
import Loader from "./components/Loader";
import { MultiplayerContext } from "./context/MultiplayerContext";
import { Msg } from "../types/types";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

function App() {
  const { socket } = useContext(SocketContext);
  const { gameId, setDrawOffered, setMessages, resetGame } =
    useContext(GameContext);
  const { setFriendRequests, setFriends, updateFriends } =
    useContext(FriendContext);
  const { setIsLoggedIn, setLoggedUserInfo, isLoggedIn } =
    useContext(AuthContext);
  const { addGameInvite, setMsgNotif } = useContext(MultiplayerContext);
  const [openOpponentLeft, setOpenOpponentLeft] = useState(false);
  const [openDrawModal, setOpenDrawModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/auth/getLoginStatus"
        );

        setLoading(false);
        setIsLoggedIn(response.data.status);
        setLoggedUserInfo(response.data.userInfo);
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false);
        setLoading(false);
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
    socket?.on("receiveMessage", (message: Msg) => {
      setMessages((prev) => [...prev, message]);
      setMsgNotif(true);
    });

    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("receiveInvite", (userInfo: UserInfo) => {
      addGameInvite(userInfo);
    });

    return () => {
      socket?.off("receiveInvite");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("friendRequestAccepted", (userInfo: UserInfo) => {
      updateFriends(userInfo);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("getFriendRequest", (request: UserRequest) => {
      setFriendRequests((prev) => [...prev, request]);
    });

    return () => {
      socket?.off("getFriendRequest");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("deletedFromFriends", (requestId: number) => {
      console.log("doslo");
      setFriends((prev) => prev.filter((friend) => friend.id !== requestId));
    });

    return () => {
      socket?.off("deletedFromFriends");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("gameStart", (gameId: string) => {
      navigate(`/multiplayer/${gameId}`);
    });

    return () => {
      socket?.off("gameStart");
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket?.on("opponentResigned", () => {
      setOpenOpponentLeft(true);
      resetGame();
      navigate("/menu");
    });

    return () => {
      socket?.off("opponentResigned");
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket?.on("draw", () => {
      setOpenDrawModal(true);
      setDrawOffered(false);
      resetGame();
      navigate("/menu");
    });

    return () => {
      socket?.off("draw");
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket?.on("invalidInvite", () => {
      toast.error("This invite is no longer valid", {
        position: "top-center",
        progressClassName: "bar",
      });
    });

    return () => {
      socket?.off("invalidInvite");
    };
  }, [socket]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Routes>
        <Route path="*" element={<div>Not found</div>} />

        <Route element={<ProtectedAuthPages />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/multiplayer/:gameId" element={<Multiplayer />} />
          <Route path="/singlePlayer" element={<SinglePlayer />} />
        </Route>
      </Routes>

      {openOpponentLeft && (
        <OpponentLeft setOpenOpponentLeft={setOpenOpponentLeft} />
      )}
      {openDrawModal && <Draw setOpenDrawModal={setOpenDrawModal} />}
    </div>
  );
}

export default App;
