import React, { useState, useEffect, useRef } from "react";
import { MoveData, Square } from "../../types/types";
import { useGameStore } from "../store/useGameStore";
import { useAuthStore } from "../store/useAuthStore";
import { useBoardRotation } from "./useBoardRotation";
import { useGameActions } from "./useGameActions";

export interface DragState {
  piece: Square;
  startRow: number;
  startCol: number;
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
}

export const useDraggablePiece = () => {
  const { movePiece, highlight } = useGameActions();
  const { gameId, playerTurn, availablePositions } = useGameStore();
  const { loggedUserInfo } = useAuthStore();
  const { shouldRotate } = useBoardRotation();
  
  const boardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const isDraggable = (piece: Square) => {
    if (!piece) return false;
    if (!gameId) return playerTurn?.color === piece.color;
    return (
      playerTurn?.color === piece.color &&
      playerTurn.playerData?.userId === loggedUserInfo?.userId
    );
  };

  const handlePointerDown = (
    e: React.PointerEvent,
    row: number,
    col: number,
    piece: Square
  ) => {
    if (!isDraggable(piece)) return;

    if (e.button !== 0) return;

    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragState({
      piece,
      startRow: row,
      startCol: col,
      currentX: e.clientX,
      currentY: e.clientY,
      offsetX,
      offsetY,
      isDragging: false,
    });

    highlight({
      position: { row, col },
      gameId,
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();

      const dist = Math.sqrt(
        Math.pow(e.clientX - dragState.currentX, 2) +
          Math.pow(e.clientY - dragState.currentY, 2)
      );

      if (!dragState.isDragging && dist > 5) {
        setDragState((prev) => (prev ? { ...prev, isDragging: true } : null));
      }

      if (dragState.isDragging || dist > 5) {
        setDragState((prev) =>
          prev
            ? {
                ...prev,
                isDragging: true,
                currentX: e.clientX,
                currentY: e.clientY,
              }
            : null
        );
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      e.preventDefault();

      if (dragState.isDragging && boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();

        const x = e.clientX - boardRect.left;
        const y = e.clientY - boardRect.top;
        const squareWidth = boardRect.width / 8;
        const squareHeight = boardRect.height / 8;

        let col = Math.floor(x / squareWidth);
        let row = Math.floor(y / squareHeight);

        if (col < 0 || col > 7 || row < 0 || row > 7) {
          setDragState(null);
          return;
        }

        if (shouldRotate()) {
          row = 7 - row;
          col = 7 - col;
        }

        const canMove = availablePositions.find(
          (pos) => pos.row === row && pos.col === col
        );

        if (canMove) {
          movePiece({
            position: { row, col },
            gameId,
          });
        }
      }

      setDragState(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState, availablePositions, shouldRotate, gameId, movePiece]);

  return { dragState, handlePointerDown, boardRef };
};
