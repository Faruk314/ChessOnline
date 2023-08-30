import React, { useState } from "react";
import menuImage from "../assets/images/menu.png";
import classNames from "classnames";
import { ImUser, ImUsers } from "react-icons/im";
import { Link } from "react-router-dom";
import SoundButton from "../components/SoundButton";

const Menu = () => {
  return (
    <section className="h-[100vh] bg-amber-100 text-white font-bold flex flex-col justify-center space-y-20 items-center">
      <div className="fixed top-0 flex justify-between w-full p-4">
        <div>
          <span className="text-3xl text-green-500">ONLINE</span>
          <span className="text-2xl text-yellow-400">chess</span>
        </div>

        <div>
          <SoundButton />
        </div>
      </div>

      <img src={menuImage} className="w-[40rem]" />
      <div className="grid gap-4">
        <Link
          to="/game"
          className="flex items-center px-10 py-4 space-x-2 text-2xl bg-yellow-500 rounded-md shadow-md"
        >
          <ImUser size={30} className="" />
          <span>PLAY LOCAL</span>
        </Link>

        <button className="flex items-center px-10 py-4 space-x-2 text-2xl rounded-md shadow-lg green">
          <ImUsers size={30} className="" />
          <span>MULTIPLAYER</span>
        </button>

        <button className="px-10 py-4 space-x-2 text-2xl text-center bg-red-500 rounded-md shadow-lg ">
          EXIT GAME
        </button>
      </div>
    </section>
  );
};

export default Menu;
