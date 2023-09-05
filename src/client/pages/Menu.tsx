import React, { useContext, useState } from "react";
import menuImage from "../assets/images/menu.png";
import { ImUser, ImUsers } from "react-icons/im";
import SoundButton from "../components/SoundButton";
import { SoundContext } from "../context/SoundContext";
import moveSound from "../assets/sounds/move.mp3";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FindMatch from "../modals/FindMatch";
import { SocketContext } from "../context/SocketContext";
import UserInfo from "../components/UserInfo";
import ChangeAvatar from "../modals/ChangeAvatar";
import { AuthContext } from "../context/AuthContext";

const Menu = () => {
  const { socket } = useContext(SocketContext);
  const { playSound } = useContext(SoundContext);
  const [openFindMatch, setOpenFindMatch] = useState(false);
  const { openChangeAvatar } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/logout");

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="h-[100vh] bg-amber-100 text-white font-bold flex flex-col justify-center items-center">
      <div className="fixed top-0 flex justify-between w-full p-4">
        <SoundButton />
      </div>

      <div className="fixed top-0 right-0 p-4">
        <UserInfo />
      </div>

      <div className="fixed top-[10rem]">
        <img src={menuImage} className="w-[17rem] h-[20rem]" />
      </div>

      <div className="grid gap-4 mt-[10rem] z-20">
        <button
          onMouseEnter={() => playSound(moveSound)}
          onClick={() => navigate("/singlePlayer")}
          className="flex items-center justify-center px-10 py-4 space-x-2 text-xl border-2 rounded-md shadow-md border-amber-900 bg-amber-900 hover:bg-transparent hover:text-amber-900"
        >
          <ImUser size={30} className="" />
          <span>PLAY LOCAL</span>
        </button>

        <button
          onClick={() => {
            socket?.emit("findMatch");
            setOpenFindMatch(true);
          }}
          onMouseEnter={() => playSound(moveSound)}
          className="flex items-center justify-center px-10 py-4 space-x-2 text-xl border-2 rounded-md shadow-lg border-amber-900 bg-amber-900 hover:bg-transparent hover:text-amber-900"
        >
          <ImUsers size={30} className="" />
          <span>MULTIPLAYER</span>
        </button>

        <button
          onClick={logoutHandler}
          onMouseEnter={() => playSound(moveSound)}
          className="px-10 py-4 space-x-2 text-xl text-center border-2 rounded-md shadow-lg bg-amber-900 hover:bg-transparent border-amber-900 hover:text-amber-900"
        >
          EXIT GAME
        </button>
      </div>

      {openFindMatch && <FindMatch setOpenFindMatch={setOpenFindMatch} />}
      {openChangeAvatar && <ChangeAvatar />}
    </section>
  );
};

export default Menu;
