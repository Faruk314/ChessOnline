import { useNavigate } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";

const Stalemate = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="flex flex-col items-center p-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300">
        <div className="p-4 bg-gray-600/20 rounded-full mb-4 shadow-inner border border-gray-600/30">
          <FaBalanceScale className="text-3xl text-gray-400" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-wide mb-2">Draw</h2>
          <span className="text-gray-400 font-medium">
            Stalemate
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

export default Stalemate;
