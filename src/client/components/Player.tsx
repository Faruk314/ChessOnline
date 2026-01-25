import React from "react";
import whiteKing from "../assets/images/king_w.png";
import whiteQueen from "../assets/images/queen_w.png";
import whitePawn from "../assets/images/pawn_w.png";
import whiteBishop from "../assets/images/bishop_w.png";
import whiteKnight from "../assets/images/knight_w.png";
import whiteRook from "../assets/images/rook_w.png";
import blackKing from "../assets/images/king_b.png";
import blackQueen from "../assets/images/queen_b.png";
import blackPawn from "../assets/images/pawn_b.png";
import blackBishop from "../assets/images/bishop_b .png";
import blackKnight from "../assets/images/knight_b.png";
import blackRook from "../assets/images/rook_b.png";
import blackDefault from "../assets/images/blackDefault.png";
import whiteDefault from "../assets/images/whiteDefault.png";
import { useGameStore } from "../store/useGameStore";
import { FaClock } from "react-icons/fa";

interface Props {
  index: number;
  playerName?: string;
  image?: string | null;
  time?: number; // Optional prop for now, defaults to mock time
}

const Player = ({ index, playerName, image, time }: Props) => {
  const defaultPic = [whiteDefault, blackDefault];
  const { players } = useGameStore();

  // Mock time formatting if time is not provided
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const displayTime = time !== undefined ? time : 600; // Default to 10:00

  const pawns = players[index]?.enemyPieces.filter(
    (piece) => piece.type === "pawn"
  );

  const rooks = players[index]?.enemyPieces.filter(
    (piece) => piece.type === "rook"
  );

  const knights = players[index]?.enemyPieces.filter(
    (piece) => piece.type === "knight"
  );

  const bishops = players[index]?.enemyPieces.filter(
    (piece) => piece.type === "bishop"
  );

  const king = players[index]?.enemyPieces.find(
    (piece) => piece.type === "king"
  );

  const queen = players[index]?.enemyPieces.find(
    (piece) => piece.type === "queen"
  );

  return (
    <div className="flex items-center gap-3 md:gap-4 bg-gray-800/60 backdrop-blur-sm p-3 rounded-xl border border-gray-700 w-full max-w-[500px] shadow-xl">
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={image || defaultPic[index]}
          className="w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 border-emerald-500/30 object-cover shadow-lg"
          alt={playerName || "Player"}
        />
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 min-w-0 gap-1.5">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold truncate text-sm md:text-base pr-2">
            {playerName || "Opponent"}
          </h2>
        </div>

        {/* Captured Pieces */}
        <div className="flex flex-wrap gap-0.5 md:gap-1 min-h-[1.5rem] items-center bg-gray-900/50 rounded-lg px-2 py-1 border border-gray-700/50">
          <div className="flex -space-x-1.5 md:-space-x-1">
            {pawns?.map((pawn, i) => (
              <img
                key={`pawn-${i}`}
                className="w-3 h-3 md:w-4 md:h-4 object-contain opacity-80"
                src={pawn.color === "black" ? blackPawn : whitePawn}
                alt="pawn"
              />
            ))}
          </div>

          <div className="flex -space-x-1.5 md:-space-x-1">
            {rooks?.map((rook, i) => (
              <img
                key={`rook-${i}`}
                className="w-3 h-3 md:w-4 md:h-4 object-contain opacity-80"
                src={rook.color === "black" ? blackRook : whiteRook}
                alt="rook"
              />
            ))}
          </div>

          <div className="flex -space-x-1.5 md:-space-x-1">
            {knights?.map((knight, i) => (
              <img
                key={`knight-${i}`}
                className="w-3 h-3 md:w-4 md:h-4 object-contain opacity-80"
                src={knight.color === "black" ? blackKnight : whiteKnight}
                alt="knight"
              />
            ))}
          </div>

          <div className="flex -space-x-1.5 md:-space-x-1">
            {bishops?.map((bishop, i) => (
              <img
                key={`bishop-${i}`}
                className="w-3 h-3 md:w-4 md:h-4 object-contain opacity-80"
                src={bishop.color === "black" ? blackBishop : whiteBishop}
                alt="bishop"
              />
            ))}
          </div>

          {queen && (
            <img
              className="w-3 h-3 md:w-4 md:h-4 object-contain opacity-80"
              src={queen.color === "black" ? blackQueen : whiteQueen}
              alt="queen"
            />
          )}

          {king && (
            <img
              className="w-3 h-3 md:w-4 md:h-4 object-contain opacity-80"
              src={king.color === "black" ? blackKing : whiteKing}
              alt="king"
            />
          )}
        </div>
      </div>

      {/* Timer Section */}
      <div className="flex items-center justify-center bg-gray-900 rounded-lg px-3 py-2 md:px-4 md:py-2 border border-gray-700 shadow-inner">
        <div className="flex items-center gap-2">
          <FaClock className="text-gray-500 text-xs md:text-sm" />
          <span className="font-mono text-xl md:text-3xl font-bold text-emerald-400 tracking-wider">
            {formatTime(displayTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Player;
