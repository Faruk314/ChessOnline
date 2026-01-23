import { useContext, useEffect, useState } from "react";
import Menu from "./pages/Menu";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import axios from "axios";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import Multiplayer from "./pages/Multiplayer";
import SinglePlayer from "./pages/SinglePlayer";
import OpponentLeft from "./modals/OpponentLeft";
import Draw from "./modals/Draw";
import ProtectedAuthPages from "./protection/ProtectedAuthPages";
import ProtectedRoutes from "./protection/ProtectedRoutes";
import Loader from "./components/Loader";
import { useFriendEvents } from "./hooks/useFriendEvents";
import { useGameEvents } from "./hooks/useGameEvents";

axios.defaults.withCredentials = true;

function App() {
  const { setIsLoggedIn, setLoggedUserInfo } = useContext(AuthContext);
  const [openOpponentLeft, setOpenOpponentLeft] = useState(false);
  const [openDrawModal, setOpenDrawModal] = useState(false);
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

  useFriendEvents();
  useGameEvents();

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
          <Route path="/singlePlayer/:gameId" element={<SinglePlayer />} />
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
