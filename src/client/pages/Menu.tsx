import React, { useContext, useState } from "react";
import menuImage from "../assets/images/menu.png";
import classNames from "classnames";
import { ImUser, ImUsers } from "react-icons/im";
import { Link } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import { SoundContext } from "../context/SoundContext";
import moveSound from "../assets/sounds/move.mp3";

const Menu = () => {
  const { playSound } = useContext(SoundContext);

  return (
    <section className="h-[100vh] bg-amber-100 text-white font-bold flex flex-col justify-center space-y-20 items-center">
      <div className="fixed top-0 flex justify-between w-full p-4">
        <div>
          <SoundButton />
        </div>
      </div>

      <div className="grid gap-4">
        <img src={menuImage} className="w-[20rem] h-[20rem]" />

        <Link
          onMouseEnter={() => playSound(moveSound)}
          to="/game"
          className="flex items-center justify-center px-10 py-4 space-x-2 text-2xl border-2 rounded-md shadow-md border-amber-900 bg-amber-900 hover:bg-transparent hover:text-amber-900"
        >
          <ImUser size={30} className="" />
          <span>PLAY LOCAL</span>
        </Link>

        <button
          onMouseEnter={() => playSound(moveSound)}
          className="flex items-center justify-center px-10 py-4 space-x-2 text-2xl border-2 rounded-md shadow-lg border-amber-900 bg-amber-900 hover:bg-transparent hover:text-amber-900"
        >
          <ImUsers size={30} className="" />
          <span>MULTIPLAYER</span>
        </button>

        <button
          onMouseEnter={() => playSound(moveSound)}
          className="px-10 py-4 space-x-2 text-2xl text-center border-2 rounded-md shadow-lg bg-amber-900 hover:bg-transparent border-amber-900 hover:text-amber-900"
        >
          EXIT GAME
        </button>
      </div>
    </section>
  );
};

export default Menu;
