import React, { ReactElement, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: Props) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
