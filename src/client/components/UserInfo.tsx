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
      className="flex flex-col items-end gap-2 md:gap-3 transition-all duration-300"
    >
      <div className="relative group cursor-pointer">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10 transition-all duration-300 group-hover:border-emerald-500 group-hover:shadow-emerald-500/30">
          <img
            src={loggedUserInfo?.image || defaultAvatar}
            className="w-20 h-20 md:w-32 md:h-32 object-cover transition-all duration-300"
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
            <FaCamera className="text-white text-2xl md:text-4xl drop-shadow-md transform scale-90 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Online Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-7 md:h-7 bg-emerald-500 border-2 md:border-4 border-gray-900 rounded-full shadow-sm transition-all duration-300"></div>
      </div>

      <div className="flex flex-col items-end">
        <div className="w-20 md:w-32 px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl bg-gray-800/80 border border-gray-700 shadow-sm backdrop-blur-sm text-left transition-all duration-300">
          <div className="flex items-center justify-start gap-2 leading-none">
            <span className="text-gray-400 text-[10px] md:text-sm font-medium uppercase tracking-wider">
              Player
            </span>
          </div>
          <div className="text-emerald-400 font-bold text-xs md:text-lg tracking-wide leading-none truncate">
            {loggedUserInfo?.userName || "Guest"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
