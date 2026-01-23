import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedAuthPages = () => {
  const { isLoggedIn } = useAuthStore();

  return !isLoggedIn ? <Outlet /> : <Navigate to="/menu" />;
};

export default ProtectedAuthPages;
