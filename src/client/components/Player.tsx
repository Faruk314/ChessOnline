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
    <div className="flex items-stretch gap-3 bg-gray-800/90 p-2 md:p-3 rounded-2xl border border-gray-700 w-full max-w-[600px] shadow-xl relative overflow-hidden">
      {/* Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-700"></div>

      {/* Avatar Section */}
      <div className="relative shrink-0 ml-2 self-center">
        <img
          src={image || defaultPic[index]}
          className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-md border-2 border-gray-700"
          alt={playerName || "Player"}
        />
      </div>

      {/* Middle Section: Name & Captured */}
      <div className="flex flex-col justify-center flex-1 min-w-0 gap-1 md:gap-2 pl-1">
        <h2 className="text-gray-100 font-bold truncate text-sm md:text-lg leading-tight tracking-wide">
          {playerName || "Opponent"}
        </h2>

        {/* Captured Pieces Container - Clean & Minimal */}
        <div className="flex flex-wrap gap-1 items-center min-h-[1.25rem]">
          {pawns?.length > 0 && (
            <div className="flex -space-x-2 md:-space-x-2.5">
              {pawns.map((pawn, i) => (
                <img
                  key={`pawn-${i}`}
                  className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-sm"
                  src={pawn.color === "black" ? blackPawn : whitePawn}
                  alt="pawn"
                />
              ))}
            </div>
          )}

          {rooks?.length > 0 && (
            <div className="flex -space-x-2 md:-space-x-2.5 ml-1">
              {rooks.map((rook, i) => (
                <img
                  key={`rook-${i}`}
                  className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-sm"
                  src={rook.color === "black" ? blackRook : whiteRook}
                  alt="rook"
                />
              ))}
            </div>
          )}

          {knights?.length > 0 && (
            <div className="flex -space-x-2 md:-space-x-2.5 ml-1">
              {knights.map((knight, i) => (
                <img
                  key={`knight-${i}`}
                  className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-sm"
                  src={knight.color === "black" ? blackKnight : whiteKnight}
                  alt="knight"
                />
              ))}
            </div>
          )}

          {bishops?.length > 0 && (
            <div className="flex -space-x-2 md:-space-x-2.5 ml-1">
              {bishops.map((bishop, i) => (
                <img
                  key={`bishop-${i}`}
                  className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-sm"
                  src={bishop.color === "black" ? blackBishop : whiteBishop}
                  alt="bishop"
                />
              ))}
            </div>
          )}

          {queen && (
            <div className="ml-1">
              <img
                className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-sm"
                src={queen.color === "black" ? blackQueen : whiteQueen}
                alt="queen"
              />
            </div>
          )}

          {king && (
            <div className="ml-1">
              <img
                className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-sm"
                src={king.color === "black" ? blackKing : whiteKing}
                alt="king"
              />
            </div>
          )}
        </div>
      </div>

      {/* Timer Section - Right aligned, distinct */}
      <div className="flex items-center justify-center bg-black/40 rounded-xl px-3 md:px-5 border border-gray-700/50 min-w-[90px] md:min-w-[120px]">
        <span
          className={`font-mono text-xl md:text-3xl font-bold tracking-widest ${
            displayTime < 30 ? "text-red-500 animate-pulse" : "text-emerald-400"
          }`}
        >
          {formatTime(displayTime)}
        </span>
      </div>
    </div>
  );
};

export default Player;
