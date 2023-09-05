import React, { useContext, useState } from "react";
import { FaRegImage } from "react-icons/fa";
import defaultAvatar from "../assets/images/avatar.png";
import { AuthContext } from "../context/AuthContext";
import ChangeAvatar from "../modals/ChangeAvatar";

const UserInfo = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { loggedUserInfo, setOpenChangeAvatar } = useContext(AuthContext);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="text-black"
    >
      <div className="relative rounded-md">
        <img
          src={loggedUserInfo?.image || defaultAvatar}
          className="w-[6.5rem] h-[6.5rem] rounded-md"
        />

        {isHovering && (
          <button
            onClick={() => setOpenChangeAvatar(true)}
            className="absolute inset-0 flex items-center justify-center rounded-md bg-[rgba(0,0,0,0.6)]"
          >
            <FaRegImage size={25} className="text-white" />
          </button>
        )}
      </div>

      <div className="p-1 mt-2 text-center text-white rounded-md bg-amber-900">
        <h2>{loggedUserInfo?.userName}</h2>
      </div>
    </div>
  );
};

export default UserInfo;
