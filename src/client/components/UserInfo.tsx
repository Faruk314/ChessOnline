import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import defaultAvatar from "../assets/images/avatar.png";

import { useAuthStore } from "../store/useAuthStore";
import classNames from "classnames";

const UserInfo = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { loggedUserInfo, setOpenChangeAvatar } = useAuthStore();

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex flex-col items-center gap-2 transition-all duration-300 w-24"
    >
      <div className="relative group cursor-pointer w-full aspect-square">
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10 transition-all duration-300 group-hover:border-emerald-500 group-hover:shadow-emerald-500/30 w-full h-full">
          <img
            src={loggedUserInfo?.image || defaultAvatar}
            className="w-full h-full object-cover transition-all duration-300"
            alt="User Avatar"
          />

          <div
            onClick={() => setOpenChangeAvatar(true)}
            className={classNames(
              "absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] transition-opacity duration-200",
              {
                "opacity-100": isHovering,
                "opacity-0": !isHovering,
              }
            )}
          >
            <FaCamera className="text-white text-3xl drop-shadow-md transform scale-90 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Online Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-gray-900 rounded-full shadow-sm transition-all duration-300"></div>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="w-full px-1 py-2 rounded-xl bg-gray-800/80 border border-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">
              Player
            </span>
          </div>
          <div className="text-emerald-400 font-bold text-sm tracking-wide leading-none truncate px-1">
            {loggedUserInfo?.userName || "Guest"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
