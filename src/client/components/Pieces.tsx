import React from "react";
import { Square } from "../../types/types";
import classNames from "classnames";
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
import { MoveData } from "../../types/types";
import { useAuthStore } from "../store/useAuthStore";
import { useBoardRotation } from "../hooks/useBoardRotation";
import { useGameStore } from "../store/useGameStore";

interface Props {
  cell: Square;
  highlight: (cell: MoveData) => void;
}

const Pieces = ({ cell, highlight }: Props) => {
  const { shouldRotate } = useBoardRotation();
  const { playerTurn, gameId } = useGameStore();
  const { loggedUserInfo } = useAuthStore();

  const isDraggable = (color: string) => {
    if (!gameId) {
      return playerTurn?.color === color;
    }

    const isDraggable =
      playerTurn?.color === color &&
      playerTurn.playerData?.userId === loggedUserInfo?.userId;

    return isDraggable;
  };

  const handleDragStart = (e: any, data: MoveData) => {
    e.dataTransfer.effectAllowed = "move";
    let draggedPiece = e.target.children[0];
    draggedPiece.style.backgroundColor = "transparent";
    const offsetX = draggedPiece.width / 2;
    const offsetY = draggedPiece.height / 2;

    e.dataTransfer.setDragImage(draggedPiece, offsetX, offsetY);

    highlight(data);
    setTimeout(() => {
      e.target.style.display = "none";
    });
  };

  const handleDragEnd = (e: any) => {
    e.target.style.display = "block";
  };

  return (
    <>
      {cell?.color === "white" ? (
        <div
          className={classNames("cursor-grab", {
            "rotate-180": shouldRotate(),
          })}
          draggable={isDraggable("white")}
          onDragStart={(e) => {
            if (isDraggable("white"))
              handleDragStart(e, {
                position: { row: cell.position.row, col: cell.position.col },
                gameId,
              });
          }}
          onDragEnd={handleDragEnd}
          onClick={() =>
            playerTurn?.color === "white" &&
            highlight({
              position: { row: cell.position.row, col: cell.position.col },
              gameId,
            })
          }
        >
          {cell.type === "pawn" && <img src={whitePawn} />}
          {cell.type === "king" && <img src={whiteKing} />}
          {cell.type === "queen" && <img src={whiteQueen} />}
          {cell.type === "bishop" && <img src={whiteBishop} />}
          {cell.type === "knight" && <img src={whiteKnight} />}
          {cell.type === "rook" && <img src={whiteRook} />}
        </div>
      ) : (
        <div
          className={classNames("cursor-grab", {
            "rotate-180": shouldRotate(),
          })}
          draggable={isDraggable("black")}
          onDragStart={(e) => {
            if (isDraggable("black"))
              handleDragStart(e, {
                position: { row: cell!.position.row, col: cell!.position.col },
                gameId,
              });
          }}
          onDragEnd={handleDragEnd}
          onClick={() =>
            playerTurn?.color === "black" &&
            highlight({
              position: { row: cell!.position.row, col: cell!.position.col },
              gameId,
            })
          }
        >
          {cell?.type === "pawn" && <img src={blackPawn} />}
          {cell?.type === "king" && <img src={blackKing} />}
          {cell?.type === "queen" && <img src={blackQueen} />}
          {cell?.type === "bishop" && <img src={blackBishop} />}
          {cell?.type === "knight" && <img src={blackKnight} />}
          {cell?.type === "rook" && <img src={blackRook} />}
        </div>
      )}
    </>
  );
};

export default Pieces;
