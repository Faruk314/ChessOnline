import whiteDefault from "../assets/images/whiteDefault.png";
import { GameInvite } from "../../types/types";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import {
  useAcceptGameInviteMutation,
  useRejectGameInviteMutation,
} from "../api/queries/gameInvites";
import { gameModeConfigs } from "../modals/GameModes";

interface Props {
  gameInvite: GameInvite;
}

const GameInviteCard = ({ gameInvite }: Props) => {
  const { mutateAsync: rejectGameInvite } = useRejectGameInviteMutation();
  const { mutateAsync: acceptGameInvite } = useAcceptGameInviteMutation();

  const modeInfo = gameModeConfigs.find((m) => m.id === gameInvite.gameMode);
  const Icon = modeInfo?.icon;

  return (
    <div className="flex items-center bg-gray-800/40 border border-gray-700 w-full justify-between p-3 rounded-xl transition-all hover:border-emerald-500/30 hover:bg-gray-800 group">
      <div className="flex items-center space-x-4">
        <img
          src={gameInvite.image || whiteDefault}
          alt=""
          className="w-12 h-12 rounded-full border-2 border-gray-600 group-hover:border-emerald-500/50 object-cover transition-colors"
        />

        <div className="flex flex-col items-start gap-1">
          <span className="font-bold text-white text-sm md:text-base leading-none">
            {gameInvite.userName}
          </span>

          {modeInfo && Icon && (
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${modeInfo.bg} ${modeInfo.color} shadow-sm`}
            >
              <Icon size={12} />
              <span>{modeInfo.label}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => acceptGameInvite({ senderId: gameInvite.userId })}
          className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95"
          title="Accept Invite"
        >
          <IoCheckmarkSharp size={20} />
        </button>
        <button
          onClick={() => rejectGameInvite({ senderId: gameInvite.userId })}
          className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
          title="Decline Invite"
        >
          <IoClose size={20} />
        </button>
      </div>
    </div>
  );
};

export default GameInviteCard;
