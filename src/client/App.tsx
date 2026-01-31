import Menu from "./pages/Menu";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Multiplayer from "./pages/Multiplayer";
import SinglePlayer from "./pages/SinglePlayer";
import ProtectedAuthPages from "./protection/ProtectedAuthPages";
import ProtectedRoutes from "./protection/ProtectedRoutes";
import { useFriendEvents } from "./hooks/useFriendEvents";
import { useGameEvents } from "./hooks/useGameEvents";
import { useLoginStatusQuery } from "./api/queries/auth";
import MainLoader from "./components/ui/MainLoader";

function App() {
  const { isLoading } = useLoginStatusQuery();

  useFriendEvents();
  useGameEvents();

  if (isLoading) {
    return <MainLoader />;
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
    </div>
  );
}

export default App;
