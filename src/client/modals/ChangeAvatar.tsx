import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import giant from "../assets/images/giant.png";
import barbarian from "../assets/images/barbarian.png";
import persian from "../assets/images/avatar.png";
import valkyrie from "../assets/images/valkyrie.png";
import goblin from "../assets/images/goblin.png";
import wizard from "../assets/images/wizard.png";
import { useAuthStore } from "../store/useAuthStore";
import { FaUserCircle } from "react-icons/fa";
import { useModalStore } from "../store/useModalStore";
import { useUpdateAvatarMutation } from "../api/queries/users";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/Button";

const ChangeAvatar = () => {
  const avatars = [persian, giant, barbarian, valkyrie, goblin, wizard];
  const { loggedUserInfo } = useAuthStore();
  const { setOpenChangeAvatar } = useModalStore();
  const [avatar, setAvatar] = useState("");
  const { mutate: updateAvatar, isPending } = useUpdateAvatarMutation();

  useEffect(() => {
    if (loggedUserInfo && loggedUserInfo.image) {
      setAvatar(loggedUserInfo.image);
    }
  }, [loggedUserInfo]);

  const handleSave = () => {
    updateAvatar(avatar, {
      onSuccess: () => {
        setOpenChangeAvatar(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 transform transition-all scale-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-emerald-500 text-2xl" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Choose Avatar
            </h2>
          </div>
          <button
            onClick={() => setOpenChangeAvatar(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {avatars.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setAvatar(imageUrl)}
                className="group relative outline-none"
              >
                <div
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden border-4 transition-all duration-200",
                    avatar === imageUrl
                      ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105"
                      : "border-gray-700 hover:border-gray-500"
                  )}
                >
                  <img
                    src={imageUrl}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {avatar === imageUrl && (
                    <div className="absolute inset-0 bg-emerald-500/10 z-10" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-800/50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={() => setOpenChangeAvatar(false)}
            className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <div className="w-40">
            <Button
              onClick={handleSave}
              isLoading={isPending}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAvatar;
