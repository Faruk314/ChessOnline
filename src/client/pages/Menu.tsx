import React, { useState } from "react";
import menuImage from "../assets/images/menu.png";
import classNames from "classnames";
import { ImUser, ImUsers } from "react-icons/im";
import { Link } from "react-router-dom";
import SoundButton from "../components/SoundButton";

const Menu = () => {
  return (
    <section className="h-[100vh] bg-amber-100 text-white font-bold flex flex-col justify-center space-y-20 items-center">
      <div className="fixed top-2 right-2">
        <SoundButton />
      </div>

      <img src={menuImage} className="w-[50rem]" />
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
      </div>
    </section>
  );
};

export default Menu;
