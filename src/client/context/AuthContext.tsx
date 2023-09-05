import React, { createContext, useState } from "react";
import { UserInfo } from "../../types/types";

interface AuthContextProps {
  loggedUserInfo: UserInfo | null;
  setLoggedUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  openChangeAvatar: boolean;
  setOpenChangeAvatar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextProps>({
  loggedUserInfo: null,
  setLoggedUserInfo: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  openChangeAvatar: false,
  setOpenChangeAvatar: () => {},
});

export const AuthContextProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserInfo, setLoggedUserInfo] = useState<UserInfo | null>(null);
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false);

  console.log(loggedUserInfo, "logged user info");

  console.log("isLoggedIn auth context", isLoggedIn);

  return (
    <AuthContext.Provider
      value={{
        loggedUserInfo,
        setLoggedUserInfo,
        isLoggedIn,
        setIsLoggedIn,
        openChangeAvatar,
        setOpenChangeAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
