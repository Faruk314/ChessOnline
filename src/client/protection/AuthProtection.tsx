import React, { ReactElement, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface Props {
  children: ReactElement;
}

const AuthProtection = ({ children }: Props) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) {
    return <Navigate to="/menu" />;
  }

  return <div>{children}</div>;
};

export default AuthProtection;
