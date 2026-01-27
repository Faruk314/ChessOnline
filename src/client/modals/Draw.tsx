import { useNavigate } from "react-router-dom";
import { FaBalanceScale, FaHandshake } from "react-icons/fa";
import { DrawReason } from "../../types/types";

interface DrawProps {
  reason: DrawReason;
}

const Draw = ({ reason }: DrawProps) => {
  const navigate = useNavigate();

  const getReasonText = (reason: DrawReason) => {
    switch (reason) {
      case "stalemate":
        return "Stalemate";
      case "insufficientMaterial":
        return "Insufficient Material";
      case "repetition":
        return "Threefold Repetition";
      case "50-move-rule":
        return "50-Move Rule";
      case "agreement":
        return "Mutual Agreement";
      default:
        return "Draw";
    }
  };

  const getIcon = (reason: DrawReason) => {
    if (reason === "agreement") {
      return <FaHandshake className="text-3xl text-gray-400" />;
    }
    return <FaBalanceScale className="text-3xl text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="flex flex-col items-center p-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300">
        <div className="p-4 bg-gray-600/20 rounded-full mb-4 shadow-inner border border-gray-600/30">
          {getIcon(reason)}
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-wide mb-2">Draw</h2>
          <span className="text-gray-400 font-medium">
            {getReasonText(reason)}
          </span>
        </div>

        <button
          onClick={() => {
            navigate("/menu");
          }}
          className="w-full py-3 px-6 text-lg font-bold text-white rounded-xl bg-gray-700 hover:bg-gray-600 border border-gray-600 shadow-lg transition-all active:scale-[0.98]"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
};

export default Draw;
