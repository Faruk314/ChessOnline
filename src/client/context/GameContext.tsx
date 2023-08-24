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
import _, { cloneDeep } from "lodash";

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

  useEffect(() => {
    const initGame = () => {
      const whitePlayer = new Player("white");
      const blackPlayer = new Player("black");

      //Create board
      const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          //checkmate situation 1
          // if (row === 7 && col === 0) {
          //   board[row][col] = createPawn(row, col, "white", "rook");
          // }
          // if (row === 0 && col === 3) {
          //   board[row][col] = createPawn(row, col, "black", "king");
          // }
          // if (row === 1 && col === 5) {
          //   board[row][col] = createPawn(row, col, "white", "rook");
          // }
          //checkmate situation 2
          // if (row === 0 && col === 7) {
          //   board[row][col] = createPawn(row, col, "black", "king");
          // }
          // if (row === 1 && col === 6) {
          //   board[row][col] = createPawn(row, col, "black", "pawn");
          // }
          // if (row === 1 && col === 7) {
          //   board[row][col] = createPawn(row, col, "black", "pawn");
          // }
          // if (row === 5 && col === 0) {
          //   board[row][col] = createPawn(row, col, "white", "queen");
          // }
          //checkmate situation 3
          // if (row === 7 && col === 0) {
          //   board[row][col] = createPawn(row, col, "white", "queen");
          // }
          // if (row === 0 && col === 3) {
          //   board[row][col] = createPawn(row, col, "black", "king");
          // }
          // if (row === 1 && col === 5) {
          //   board[row][col] = createPawn(row, col, "white", "queen");
          // }
          //checkmate situation 4
          // if (row === 0 && col === 0) {
          //   board[row][col] = createPawn(row, col, "black", "king");
          // }
          // if (row === 2 && col === 1) {
          //   board[row][col] = createPawn(row, col, "white", "king");
          // }
          // if (row === 2 && col === 3) {
          //   board[row][col] = createPawn(row, col, "white", "bishop");
          // }
          // if (row === 1 && col === 7) {
          //   board[row][col] = createPawn(row, col, "white", "bishop");
          // }
          //checkmate situation 5
          // if (row === 5 && col === 0) {
          //   board[row][col] = createPawn(row, col, "white", "queen");
          // }
          // if (row === 1 && col === 6) {
          //   board[row][col] = createPawn(row, col, "black", "pawn");
          // }
          // if (row === 2 && col === 6) {
          //   board[row][col] = createPawn(row, col, "black", "pawn");
          // }
          // if (row === 0 && col === 7) {
          //   board[row][col] = createPawn(row, col, "black", "king");
          // }
          // if (row === 1 && col === 4) {
          //   board[row][col] = createPawn(row, col, "white", "knight");
          // }
          //checkmate situation 6
          // if (row === 0 && col === 3) {
          //   board[row][col] = createPawn(row, col, "black", "queen");
          // }
          // if (row === 0 && col === 4) {
          //   board[row][col] = createPawn(row, col, "black", "king");
          // }
          // if (row === 0 && col === 5) {
          //   board[row][col] = createPawn(row, col, "black", "rook");
          // }
          // if (row === 1 && col === 3) {
          //   board[row][col] = createPawn(row, col, "black", "pawn");
          // }
          // if (row === 1 && col === 4) {
          //   board[row][col] = createPawn(row, col, "black", "knight");
          // }
          // if (row === 1 && col === 5) {
          //   board[row][col] = createPawn(row, col, "black", "pawn");
          // }
          // if (row === 4 && col === 2) {
          //   board[row][col] = createPawn(row, col, "white", "knight");
          // }

          //importnant
          if (row === 6 && (col === 2 || col === 1))
            board[row][col] = createPawn(row, col, "white", "pawn");
          if (row === 7) {
            if (col === 0 || col === 7) {
              board[row][col] = createPawn(row, col, "white", "rook");
            }
            board[row][4] = createPawn(row, 4, "white", "king");
            board[row][3] = createPawn(row, 3, "white", "queen");
            if (col === 1 || col === 6)
              board[row][col] = createPawn(row, col, "white", "knight");
            if (col === 2 || col === 5)
              board[row][col] = createPawn(row, col, "white", "bishop");
          }
          if (row === 1)
            board[row][col] = createPawn(row, col, "black", "pawn");
          if (row === 0) {
            if (col === 0 || col === 7) {
              board[row][col] = createPawn(row, col, "black", "rook");
            }
            board[row][4] = createPawn(row, 4, "black", "king");
            board[row][3] = createPawn(row, 3, "black", "queen");
            if (col === 1 || col === 6)
              board[row][col] = createPawn(row, col, "black", "knight");
            if (col === 2 || col === 5)
              board[row][col] = createPawn(row, col, "black", "bishop");
          }
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

  const highlightPawn = (piece: Piece, stop: boolean, newBoard: Square[][]) => {
    let firstPos: Position | null = null;
    let secondPos: Position | null = null;
    let leftDiagonal: Position | null = null;
    let rightDiagonal: Position | null = null;
    let currentRow = piece.position.row;
    let currentCol = piece.position.col;
    let validMoves: Position[] = [];
    let board = _.cloneDeep(newBoard);

    if (piece.color === "white") {
      firstPos = { row: currentRow - 1, col: currentCol, direction: "up" };

      !board[currentRow - 1][currentCol] && validMoves.push(firstPos);

      if (currentRow === 6 && board[currentRow - 1][currentCol] === null) {
        secondPos = { row: currentRow - 2, col: currentCol, direction: "down" };
        validMoves = [secondPos];
      }

      if (
        board[currentRow - 1][currentCol + 1] !== null &&
        board[currentRow - 1][currentCol + 1]?.color !== piece.color
      ) {
        rightDiagonal = {
          row: currentRow - 1,
          col: currentCol + 1,
          direction: "rd",
        };
        validMoves.push(rightDiagonal);
      }

      if (
        board[currentRow - 1][currentCol - 1] !== null &&
        board[currentRow - 1][currentCol - 1]?.color !== piece.color
      ) {
        leftDiagonal = {
          row: currentRow - 1,
          col: currentCol - 1,
          direction: "ld",
        };

        validMoves.push(leftDiagonal);
      }
    }

    if (piece.color === "black") {
      firstPos = { row: currentRow + 1, col: currentCol, direction: "up" };

      if (board[currentRow + 1][currentCol] === null) {
        validMoves.push(firstPos);
      }

      if (currentRow === 1 && board[currentRow + 1][currentCol] === null) {
        secondPos = { row: currentRow + 2, col: currentCol, direction: "down" };

        validMoves = [secondPos];
      }

      if (
        board[currentRow + 1][currentCol + 1] !== null &&
        board[currentRow + 1][currentCol + 1]?.color !== piece.color
      ) {
        rightDiagonal = {
          row: currentRow + 1,
          col: currentCol + 1,
          direction: "rd",
        };

        validMoves.push(rightDiagonal);
      }

      if (
        board[currentRow + 1][currentCol - 1] !== null &&
        board[currentRow + 1][currentCol - 1]?.color !== piece.color
      ) {
        leftDiagonal = {
          row: currentRow + 1,
          col: currentCol - 1,
          direction: "ld",
        };

        validMoves.push(leftDiagonal);
      }
    }

    if (!stop) validMoves = getValidCheckMoves(validMoves, piece);

    return validMoves;
  };

  const highlightKnight = (
    piece: Piece,
    stop: boolean,
    newBoard: Square[][]
  ) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let board = _.cloneDeep(newBoard);

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

    return validMoves;
  };

  const highlightBishop = (
    piece: Piece,
    stop: boolean,
    newBoard: Square[][]
  ) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];
    let board = _.cloneDeep(newBoard);

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

    if (!stop) validMoves = getValidCheckMoves(validMoves, piece);

    return validMoves;
  };

  const getValidCheckMoves = (validMoves: Position[], piece: Piece) => {
    if (checkPositions.length > 0) {
      validMoves = validMoves.filter((move) => {
        const validMove = checkPositions.some(
          (position) => position.col === move.col && position.row === move.row
        );

        return validMove;
      });
    }

    return validMoves;
  };

  const highlightRook = (piece: Piece, stop: boolean, newBoard: Square[][]) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let board = _.cloneDeep(newBoard);
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
            (board[r][c]?.color === "white" && piece.color === "black") ||
            (board[r][c]?.color === "black" && piece.color === "white")
          ) {
            validMoves.push({ row: r, col: c, direction: direction.direction });
          }
          break;
        }
        r += direction.row;
        c += direction.col;
      }
    });

    if (!stop) {
      validMoves = getValidCheckMoves(validMoves, piece);
    }

    console.log(validMoves, "rook moves");

    return validMoves;
  };

  const highlightQueen = (
    piece: Piece,
    stop: boolean,
    newBoard: Square[][]
  ) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];
    let board = _.cloneDeep(newBoard);

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
            (board[r][c]?.color === "white" && piece.color === "black") ||
            (board[r][c]?.color === "black" && piece.color === "white")
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

  const getAttackedPositions = (
    board: Square[][],
    pieceColor: string,
    stop?: boolean
  ) => {
    let positionsUnderAttack: Position[] = [];

    board.flat().forEach((cell) => {
      if (cell !== null && cell.color !== pieceColor) {
        if (cell.type === "pawn")
          positionsUnderAttack.push(...highlightPawn(cell, true, board));
        if (cell.type === "knight")
          positionsUnderAttack.push(...highlightKnight(cell, true, board));
        if (cell.type === "queen")
          positionsUnderAttack.push(...highlightQueen(cell, true, board));
        if (cell.type === "bishop")
          positionsUnderAttack.push(...highlightBishop(cell, true, board));
        if (cell.type === "rook")
          positionsUnderAttack.push(...highlightRook(cell, true, board));
        if (cell.type === "king" && !stop)
          positionsUnderAttack.push(...getKingPositions(cell, board));
      }
    });

    return positionsUnderAttack;
  };

  const getKingPositions = (piece: Piece, board: Square[][]) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

    console.log(piece.color, "piece color");

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
        if (!board[r][c] || board[r][c]?.color !== piece.color) {
          validMoves.push({ row: r, col: c, direction: move.direction });
        }
      }
    });

    return validMoves;
  };

  const highlightKing = (piece: Piece, board: Square[][]) => {
    let newBoard = _.cloneDeep(board);

    let validMoves = getKingPositions(piece, board);

    //prevent the king to walk in positions where it can be eaten
    let attackedPositions: Position[] = [];

    //first take of the board current king position
    newBoard[piece.position.row][piece.position.col] = null;

    //then iterate through valid moves and simulate will they lead to dangerous pos
    validMoves.forEach((validMove) => {
      newBoard[validMove.row][validMove.col] = piece;

      attackedPositions.push(...getAttackedPositions(newBoard, piece.color));

      newBoard[validMove.row][validMove.col] = null;
    });

    //finaly we are filtering validMoves that are dangerous
    validMoves = validMoves.filter((move) => {
      let safeMove = !attackedPositions.some(
        (pos) => pos.col === move.col && pos.row === move.row
      );

      return safeMove;
    });

    console.log(
      attackedPositions.find((pos) => pos.row === 1 && pos.col === 1),
      "validMoves"
    );

    return validMoves;
  };

  const determineCheck = (board: Square[][]) => {
    let availablePositions: Position[] = [];

    //finds availablePositions for a piece that just moved to a new square
    switch (activePiece?.type) {
      case "pawn":
        availablePositions = highlightPawn(activePiece, false, board);
        break;
      case "knight":
        availablePositions = highlightKnight(activePiece, false, board);
        break;
      case "queen":
        availablePositions = highlightQueen(activePiece, false, board);
        break;
      case "bishop":
        availablePositions = highlightBishop(activePiece, false, board);
        break;
      case "rook":
        availablePositions = highlightRook(activePiece, false, board);
        break;
      case "king":
        availablePositions = highlightKing(activePiece, board);
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
    let checkPositions = availablePositions.filter(
      (position) => position.direction === kingInCheck?.direction
    );

    //also put the active piece position in check positions
    checkPositions.push(activePiece!.position);

    setCheckPositions(checkPositions);

    //determine chechMate

    //this will find all possible enemy positions but we dont need king positions so we will put true as third argument
    let enemyAttackPositions = getAttackedPositions(
      board,
      playerTurn?.color!,
      true
    );

    console.log(enemyAttackPositions, "enemyAttackPos");

    //this finds all possible king positions
    let kingPositions = highlightKing(king!, board);

    console.log(kingPositions, "kingPos");

    let positionsThatBlockCheck: Position[] = [];

    let filteredCheckPositions = checkPositions.filter(
      (pos) => pos.col !== king?.position.col && pos.row !== king?.position.row
    );

    //we have to iterate throught all the enemy positions and check

    // if we can find any of those positions in our checkPositions (that means enemy can block the check)
    filteredCheckPositions.forEach((checkPos) => {
      let position = enemyAttackPositions.find(
        (enemyPos) =>
          enemyPos.col === checkPos.col && enemyPos.row === checkPos.row
      );

      if (position) positionsThatBlockCheck.push(position);
    });

    console.log(positionsThatBlockCheck, "positionsThatBlockTheCheck");

    if (positionsThatBlockCheck.length === 0 && kingPositions.length === 0) {
      console.log("checkmate");
    }
  };

  const movePiece = (row: number, col: number) => {
    let updatedBoard = _.cloneDeep(board);
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
    determineCheck(updatedBoard);

    if (!promotion) switchTurns();
    setAvailablePositions([]);
    setBoard(updatedBoard);
  };

  const highlight = (piece: Piece) => {
    if (piece.type === "pawn")
      setAvailablePositions(highlightPawn(piece, false, board));

    if (piece.type === "rook")
      setAvailablePositions(highlightRook(piece, false, board));

    if (piece.type === "knight")
      setAvailablePositions(highlightKnight(piece, false, board));

    if (piece.type === "bishop")
      setAvailablePositions(highlightBishop(piece, false, board));

    if (piece.type === "king")
      setAvailablePositions(highlightKing(piece, board));

    if (piece.type === "queen")
      setAvailablePositions(highlightQueen(piece, false, board));

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
