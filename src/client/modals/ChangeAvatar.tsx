import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import giant from "../assets/images/giant.png";
import barbarian from "../assets/images/barbarian.png";
import persian from "../assets/images/avatar.png";
import valkyrie from "../assets/images/valkyrie.png";
import goblin from "../assets/images/goblin.png";
import wizard from "../assets/images/wizard.png";
import { AuthContext } from "../context/AuthContext";
import classNames from "classnames";
import axios from "axios";

const ChangeAvatar = () => {
  const avatars = [persian, giant, barbarian, valkyrie, goblin, wizard];
  const { setOpenChangeAvatar, setLoggedUserInfo, loggedUserInfo } =
    useContext(AuthContext);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (loggedUserInfo && loggedUserInfo.image) {
      setAvatar(loggedUserInfo.image);
    }
  }, []);

  const updateAvatar = async () => {
    try {
      await axios.post("http://localhost:3000/api/game/changeAvatar", {
        avatar: avatar,
      });

      setLoggedUserInfo((prev: any) => ({
        ...prev,
        image: avatar,
      }));

      setOpenChangeAvatar(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <div className="relative px-2 py-2 rounded-md bg-amber-100">
        <h2 className="text-2xl text-black">Change your avatar</h2>

        <button
          onClick={() => {
            setOpenChangeAvatar(false);
          }}
          className="absolute border-2 rounded-md right-1 top-1 border-amber-900 hover:bg-transparent hover:text-amber-900 bg-amber-900"
        >
          <IoClose size={27} />
        </button>

        <div className="grid grid-cols-3 gap-2 py-2">
          {avatars.map((imageUrl, index) => (
            <button onClick={() => setAvatar(imageUrl)} key={imageUrl}>
              <img
                src={imageUrl}
                className={classNames("w-[6.5rem] h-[6.5rem] rounded-md", {
                  "border-2 border-amber-900": avatar === imageUrl,
                })}
              />
            </button>
          ))}
        </div>

        <button
          onClick={updateAvatar}
          className="px-2 py-1 text-xl font-medium border-2 rounded-md border-amber-900 hover:bg-transparent hover:text-amber-900 bg-amber-900"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ChangeAvatar;
