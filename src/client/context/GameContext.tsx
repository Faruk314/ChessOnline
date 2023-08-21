import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Player } from "../classes/Player";
import { Piece } from "../classes/Piece";
import { createPawn } from "../classes/Piece";
import { Square, Position } from "../../types/types";

interface GameContextProps {
  board: Square[][];
  highlight: (piece: Piece) => void;
  availablePositions: Position[];
  movePiece: (row: number, col: number) => void;
  playerTurn: Player | null;
  isCheck: boolean;
  isPromotion: boolean;
  promotePawn: (type: string) => void;
}

export const GameContext = createContext<GameContextProps>({
  board: [],
  highlight: (piece) => {},
  availablePositions: [],
  movePiece: (row, col) => {},
  playerTurn: null,
  isCheck: false,
  isPromotion: false,
  promotePawn: (type) => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [board, setBoard] = useState<Square[][]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerTurn, setPlayerTurn] = useState<Player | null>(null);
  const [availablePositions, setAvailablePositions] = useState<Position[]>([]);
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const [isCheck, setIsCheck] = useState(false);
  const [isPromotion, setIsPromotion] = useState(false);
  const [checkPositions, setCheckPositions] = useState<Position[]>([]);
  const [checkmate, setCheckmate] = useState(false);

  console.log(checkPositions, "checkPositions");

  useEffect(() => {
    const initGame = () => {
      const whitePlayer = new Player("white");
      const blackPlayer = new Player("black");

      //Create board
      const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (row === 2 && col === 5) {
            board[row][col] = createPawn(row, col, "black", "pawn");
          }

          if (row === 0 && col === 6) {
            board[row][col] = createPawn(row, col, "black", "king");
          }

          if (row === 1 && col === 4) {
            board[row][col] = createPawn(row, col, "black", "bishop");
          }

          // if (row === 2 && col === 6) {
          //   board[row][col] = createPawn(row, col, "black", "rook");
          // }

          if (row === 3 && col === 2) {
            board[row][col] = createPawn(row, col, "white", "queen");
          }

          if (row === 3 && col === 4) {
            board[row][col] = createPawn(row, col, "white", "queen");
          }

          if (row === 7 && col === 2) {
            board[row][col] = createPawn(row, col, "white", "queen");
          }

          if (row === 2 && col === 7) {
            board[row][col] = createPawn(row, col, "white", "rook");
          }

          if (row === 4 && col === 6) {
            board[row][col] = createPawn(row, col, "black", "queen");
          }

          // if (row === 0 && col === 6) {
          //   board[row][col] = createPawn(row, col, "black", "bishop");
          // }

          //importnant
          // if (row === 6 && (col === 2 || col === 1))
          //   board[row][col] = createPawn(row, col, "white", "pawn");
          // if (row === 7) {
          //   if (col === 0 || col === 7) {
          //     board[row][col] = createPawn(row, col, "white", "rook");
          //   }
          //   board[row][4] = createPawn(row, 4, "white", "king");
          //   board[row][3] = createPawn(row, 3, "white", "queen");
          //   if (col === 1 || col === 6)
          //     board[row][col] = createPawn(row, col, "white", "knight");
          //   if (col === 2 || col === 5)
          //     board[row][col] = createPawn(row, col, "white", "bishop");
          // }
          // if (row === 1)
          //   board[row][col] = createPawn(row, col, "black", "pawn");
          // if (row === 0) {
          //   if (col === 0 || col === 7) {
          //     board[row][col] = createPawn(row, col, "black", "rook");
          //   }
          //   board[row][4] = createPawn(row, 4, "black", "king");
          //   board[row][3] = createPawn(row, 3, "black", "queen");
          //   if (col === 1 || col === 6)
          //     board[row][col] = createPawn(row, col, "black", "knight");
          //   if (col === 2 || col === 5)
          //     board[row][col] = createPawn(row, col, "black", "bishop");
          // }
        }
      }

      setBoard(board);
      setPlayers([whitePlayer, blackPlayer]);
      setPlayerTurn(whitePlayer);
    };

    initGame();
  }, []);

  const switchTurns = () => {
    const nextPlayer = players.find(
      (player) => player.color !== playerTurn?.color
    );

    setPlayerTurn(nextPlayer!);
  };

  const promotePawn = (type: string) => {
    const row = activePiece?.position.row;
    const col = activePiece?.position.col;
    const color = activePiece?.color;

    if (type === "queen")
      board[row!][col!] = createPawn(row!, col!, color!, "queen");

    if (type === "knight")
      board[row!][col!] = createPawn(row!, col!, color!, "knight");

    if (type === "rook")
      board[row!][col!] = createPawn(row!, col!, color!, "rook");

    if (type === "bishop")
      board[row!][col!] = createPawn(row!, col!, color!, "bishop");

    setIsPromotion(false);
    switchTurns();
  };

  const highlightPawn = (piece: Piece, stop: boolean | undefined) => {
    let firstPos: Position | null = null;
    let secondPos: Position | null = null;
    let leftDiagonal: Position | null = null;
    let rightDiagonal: Position | null = null;
    let row = piece.position.row;
    let col = piece.position.col;
    let validMoves: Position[] = [];

    if (piece.color === "white") {
      firstPos = { row: row - 1, col: col, direction: "up" };

      !board[row - 1][col] && validMoves.push(firstPos);

      if (row === 6) {
        secondPos = { row: row - 2, col: col, direction: "down" };
        validMoves = [firstPos, secondPos];
      }

      if (board[row - 1][col + 1]) {
        rightDiagonal = { row: row - 1, col: col + 1, direction: "rd" };
        validMoves.push(rightDiagonal);
      }

      if (board[row - 1][col - 1]) {
        leftDiagonal = { row: row - 1, col: col - 1, direction: "ld" };

        validMoves.push(leftDiagonal);
      }
    }

    if (piece.color === "black") {
      firstPos = { row: row + 1, col: col, direction: "up" };

      !board[row - 1][col] && validMoves.push(firstPos);

      if (row === 1) {
        secondPos = { row: row + 2, col: col, direction: "down" };

        validMoves = [firstPos, secondPos];
      }

      if (board[row + 1][col + 1]) {
        rightDiagonal = { row: row + 1, col: col + 1, direction: "rd" };

        validMoves.push(rightDiagonal);
      }

      if (board[row + 1][col - 1]) {
        leftDiagonal = { row: row + 1, col: col - 1, direction: "ld" };

        validMoves.push(leftDiagonal);
      }
    }

    if (!stop) validMoves = getValidCheckMoves(validMoves, piece);

    return validMoves;
  };

  const highlightRook = (piece: Piece, stop: boolean | undefined) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;

    let validMoves: Position[] = [];
    let directions = [
      { row: -1, col: 0, direction: "up" },
      { row: 1, col: 0, direction: "down" },
      { row: 0, col: -1, direction: "left" },
      { row: 0, col: 1, direction: "right" },
    ];

    directions.forEach((direction) => {
      let r = currentRow + direction.row;
      let c = currentCol + direction.col;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c]) {
          validMoves.push({ row: r, col: c, direction: direction.direction });
        } else {
          if (
            (board[r][c]?.color === "black" && playerTurn?.color === "white") ||
            (board[r][c]?.color === "white" && playerTurn?.color === "black")
          ) {
            validMoves.push({ row: r, col: c, direction: direction.direction });
          }
          break;
        }
        r += direction.row;
        c += direction.col;
      }
    });

    if (!stop) validMoves = getValidCheckMoves(validMoves, piece);

    return validMoves;
  };

  const highlightKnight = (piece: Piece, stop: boolean | undefined) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;

    let validMoves: Position[] = [];

    const knightMoves = [
      { direction: "ul", row: -2, col: -1 },
      { direction: "ur", row: -2, col: 1 },
      { direction: "lu", row: -1, col: -2 },
      { direction: "ru", row: -1, col: 2 },
      { direction: "ld", row: 1, col: -2 },
      { direction: "rd", row: 1, col: 2 },
      { direction: "dl", row: 2, col: -1 },
      { direction: "dr", row: 2, col: 1 },
    ];

    knightMoves.forEach((move) => {
      const r = currentRow + move.row;
      const c = currentCol + move.col;

      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c] || board[r][c]?.color !== playerTurn?.color) {
          validMoves.push({ row: r, col: c, direction: move.direction });
        }
      }
    });

    if (!stop) validMoves = getValidCheckMoves(validMoves, piece);

    console.log(validMoves, "knightValidMoves");

    return validMoves;
  };

  const highlightBishop = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

    let directions = [
      { row: -1, col: -1, direction: "uld" }, //upper left diagonal
      { row: -1, col: 1, direction: "urd" }, //upper right diagonal
      { row: 1, col: -1, direction: "bld" }, //bottom left diagonal
      { row: 1, col: 1, direction: "brd" }, //bottom right diagonal
    ];

    directions.forEach((direction) => {
      let r = currentRow + direction.row;
      let c = currentCol + direction.col;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c]) {
          validMoves.push({ row: r, col: c, direction: direction.direction });
        } else {
          if (
            (board[r][c]?.color === "black" && playerTurn?.color === "white") ||
            (board[r][c]?.color === "white" && playerTurn?.color === "black")
          ) {
            validMoves.push({ row: r, col: c, direction: direction.direction });
          }
          break;
        }
        r += direction.row;
        c += direction.col;
      }
    });

    validMoves = getValidCheckMoves(validMoves, piece);

    return validMoves;
  };

  const getAttackedPositions = (board: Square[][]) => {
    let positionsUnderAttack: Position[] = [];

    board.flat().forEach((cell) => {
      if (cell !== null && cell.color !== playerTurn?.color) {
        if (cell.type === "pawn")
          positionsUnderAttack.push(...highlightPawn(cell, true));
        if (cell.type === "knight")
          positionsUnderAttack.push(...highlightKnight(cell, true));
        if (cell.type === "queen")
          positionsUnderAttack.push(...highlightQueen(cell, true));
        if (cell.type === "bishop")
          positionsUnderAttack.push(...highlightBishop(cell));
        if (cell.type === "rook")
          positionsUnderAttack.push(...highlightRook(cell, true));
      }
    });

    return positionsUnderAttack;
  };

  const highlightKing = (piece: Piece) => {
    let newBoard = JSON.parse(JSON.stringify(board));
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

    let kingMoves = [
      { row: -1, col: 0, direction: "up" }, //up
      { row: 1, col: 0, direction: "down" }, //down
      { row: 0, col: -1, direction: "left" }, //left
      { row: 0, col: 1, direction: "right" }, //right
      { row: -1, col: -1, direction: "uld" }, //upper left diagonal
      { row: -1, col: 1, direction: "urd" }, //upper right diagonal
      { row: 1, col: -1, direction: "bld" }, //bottom left diagonal
      { row: 1, col: 1, direction: "brd" }, //bottom right diagonal
    ];

    kingMoves.forEach((move, index) => {
      const r = currentRow + move.row;
      const c = currentCol + move.col;

      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c] || board[r][c]?.color !== playerTurn?.color) {
          validMoves.push({ row: r, col: c, direction: move.direction });
        }
      }
    });

    //this prevents king from walking in positions that are currently under atack
    let positionsUnderAttack: Position[] = getAttackedPositions(newBoard);

    //Now we need to prevent the king to create a situation that it can be eaten by simulating each move
    validMoves.forEach((move) => {
      //we put king on each one of them;
      console.log(move.row, move.col);
      newBoard[move.row][move.col] = piece;

      positionsUnderAttack.push(...getAttackedPositions(newBoard));

      newBoard[move.row][move.col] = null;
    });

    console.log(positionsUnderAttack, "positions under attack");

    validMoves = validMoves.filter((move) => {
      const moveLeadsToSafePosition = !positionsUnderAttack.some(
        (position) => position.col === move.col && position.row === move.row
      );

      return moveLeadsToSafePosition;
    });

    return validMoves;
  };

  const getValidCheckMoves = (validMoves: Position[], piece: Piece) => {
    const newBoard = JSON.parse(JSON.stringify([...board]));
    let positionsUnderAttack: Position[] = [];

    if (checkPositions.length > 0) {
      validMoves = validMoves.filter((move) => {
        const validMove = checkPositions.some(
          (position) => position.col === move.col && position.row === move.row
        );

        return validMove;
      });
    }

    console.log(validMoves, "validMoves");

    return validMoves;
  };

  const highlightQueen = (piece: Piece, stop: boolean | undefined) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];
    let checkPos: Position[] = [];

    let positions = [
      { row: -1, col: 0, direction: "up" }, //up
      { row: 1, col: 0, direction: "down" }, //down
      { row: 0, col: -1, direction: "left" }, //left
      { row: 0, col: 1, direction: "right" }, //right
      { row: -1, col: -1, direction: "uld" }, //upper left diagonal
      { row: -1, col: 1, direction: "urd" }, //upper right diagonal
      { row: 1, col: -1, direction: "bld" }, //bottom left diagonal
      { row: 1, col: 1, direction: "brd" }, //bottom right diagonal
    ];

    positions.forEach((position, index) => {
      let r = currentRow + position.row;
      let c = currentCol + position.col;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c]) {
          validMoves.push({ row: r, col: c, direction: position.direction });
        } else {
          if (
            (board[r][c]?.color === "black" && playerTurn?.color === "white") ||
            (board[r][c]?.color === "white" && playerTurn?.color === "black")
          ) {
            validMoves.push({ row: r, col: c, direction: position.direction });
          }

          break;
        }

        r += position.row;
        c += position.col;
      }
    });

    if (!stop) validMoves = getValidCheckMoves(validMoves, piece);

    return validMoves;
  };

  const determineCheck = () => {
    let availablePositions: Position[] = [];

    //finds availablePositions for a piece that just moved to a new square
    switch (activePiece?.type) {
      case "pawn":
        availablePositions = highlightPawn(activePiece, false);
        break;
      case "knight":
        availablePositions = highlightKnight(activePiece, false);
        break;
      case "queen":
        availablePositions = highlightQueen(activePiece, false);
        break;
      case "bishop":
        availablePositions = highlightBishop(activePiece);
        break;
      case "rook":
        availablePositions = highlightRook(activePiece, false);
        break;
      case "king":
        availablePositions = highlightKing(activePiece);
        break;
    }

    //finds enemy king on board
    const king = board
      .flat()
      .find(
        (piece) => piece?.type === "king" && piece.color !== playerTurn?.color
      );

    //finds if there is a king in those positions
    const kingInCheck = availablePositions.find(
      (piece) =>
        piece.col === king?.position.col && piece.row === king.position.row
    );

    //if there is not a king in available positions that means that we are not in a checkmate
    if (!kingInCheck) return;

    //we get check positions based on direction
    const checkPositions = availablePositions.filter(
      (position) => position.direction === kingInCheck?.direction
    );

    //also put the active piece position in chechpositions
    checkPositions.push(activePiece!.position);

    setCheckPositions(checkPositions);

    //chechMate

    //determine that there is no peace that can eat the pawn causing the check

    //determine that there are no pieces that can block the check

    //determine that there are no possible moves king can make to escape the check
  };

  const movePiece = (row: number, col: number) => {
    const updatedBoard = [...board];
    let promotion = false;
    setCheckPositions([]);

    if (!activePiece) return;

    updatedBoard[activePiece.position.row][activePiece.position.col] = null;
    activePiece.position.row = row;
    activePiece.position.col = col;
    updatedBoard[row][col] = activePiece;

    //determine if it is a promotion
    if (activePiece.type === "pawn" && (row === 7 || row === 0)) {
      setIsPromotion(true);
      promotion = true;
    }

    //determine if it is a check or checkmate
    const checkInfo = determineCheck();

    if (!promotion) switchTurns();
    setAvailablePositions([]);
    setBoard(updatedBoard);
  };

  const highlight = (piece: Piece) => {
    if (piece.type === "pawn")
      setAvailablePositions(highlightPawn(piece, false));

    if (piece.type === "rook")
      setAvailablePositions(highlightRook(piece, false));

    if (piece.type === "knight")
      setAvailablePositions(highlightKnight(piece, false));

    if (piece.type === "bishop") setAvailablePositions(highlightBishop(piece));

    if (piece.type === "king") setAvailablePositions(highlightKing(piece));

    if (piece.type === "queen")
      setAvailablePositions(highlightQueen(piece, false));

    setActivePiece(piece);
  };

  const contextValue: GameContextProps = {
    board,
    highlight,
    availablePositions,
    movePiece,
    playerTurn,
    isCheck,
    isPromotion,
    promotePawn,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
