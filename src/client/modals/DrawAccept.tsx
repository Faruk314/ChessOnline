import { useModalStore } from "../store/useModalStore";
import { FaHandshake } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const DrawAccept = () => {
  const { setOpenDrawAcceptModal } = useModalStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gray-500/20 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="p-8 flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="p-4 bg-gray-500/10 rounded-full border-2 border-gray-500/50 shadow-lg shadow-gray-500/20 animate-pulse">
            <FaHandshake className="text-4xl text-gray-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Game Drawn
            </h2>
            <p className="text-gray-400 text-sm">
              The game has ended in a draw by mutual agreement.
            </p>
            <div className="py-2">
              <span className="inline-block px-4 py-1 rounded-full bg-gray-500/20 text-gray-400 font-bold border border-gray-500/30 text-lg shadow-[0_0_15px_rgba(107,114,128,0.3)]">
                ½ - ½
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpenDrawAcceptModal(false)}
            className="w-full px-6 py-3 text-base font-bold text-white bg-gray-700 rounded-xl hover:bg-gray-600 border border-gray-600 transition-all duration-200 shadow-lg hover:-translate-y-0.5"
          >
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawAccept;
