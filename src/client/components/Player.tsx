import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
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
import avatar from "../assets/images/avatar.png";

interface Props {
  index: number;
  playerName?: string;
  image?: string | null;
}

const Player = ({ index, playerName }: Props) => {
  const { players } = useContext(GameContext);

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
    <div className="flex space-x-2">
      <div>
        <img src={avatar} className="w-[3.5rem] border-black rounded-md"></img>
      </div>

      <div className="flex flex-col">
        <div className="text-[1rem] flex space-x-1 font-bold">
          <h2>{playerName}</h2>
          <span>(962)</span>
        </div>
        <div className="flex space-x-1">
          <div className="flex">
            {pawns?.map((pawn, index) => (
              <img
                key={index}
                className="w-[1.5rem]"
                src={pawn.color === "black" ? blackPawn : whitePawn}
              />
            ))}
          </div>

          <div className="flex">
            {rooks?.map((pawn, index) => (
              <img
                key={index}
                className="w-[1.5rem]"
                src={pawn.color === "black" ? blackRook : whiteRook}
              />
            ))}
          </div>

          <div className="flex">
            {knights?.map((pawn, index) => (
              <img
                key={index}
                className="w-[1.5rem]"
                src={pawn.color === "black" ? blackKnight : whiteKnight}
              />
            ))}
          </div>

          <div className="flex">
            {bishops?.map((pawn, index) => (
              <img
                key={index}
                className="w-[1.5rem]"
                src={pawn.color === "black" ? blackBishop : whiteBishop}
              />
            ))}
          </div>

          {king && (
            <img
              className="w-[1.5rem]"
              src={king?.color === "black" ? blackKing : whiteKing}
            />
          )}

          {queen && (
            <img
              className="w-[1.5rem]"
              src={queen?.color === "black" ? blackQueen : whiteQueen}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
