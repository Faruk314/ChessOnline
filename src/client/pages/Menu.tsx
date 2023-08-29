import React, { useState } from "react";
import menuImage from "../assets/images/menu.png";
import classNames from "classnames";
import { ImUser, ImUsers } from "react-icons/im";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <section className="h-[100vh] text-white bg-amber-100 flex justify-center items-center">
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/game"
          className="flex items-center h-[10rem] px-10 space-x-2 text-2xl rounded-md bg-amber-900"
        >
          <ImUser size={30} />
          <span>PLAY LOCAL</span>
        </Link>

        <button className="flex items-center h-[10rem] px-10 space-x-2 text-2xl rounded-md bg-amber-900">
          <ImUsers size={30} />
          <span>MULTIPLAYER</span>
        </button>
      </div>
    </section>
  );
};

export default Menu;
