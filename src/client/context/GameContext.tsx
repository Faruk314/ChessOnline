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
import { Square, Position, Game } from "../../types/types";
import _, { cloneDeep, find, first, update } from "lodash";
import { SoundContext } from "./SoundContext";
import move from "../assets/sounds/move.mp3";
import axios from "axios";
import { Data, MoveData, PromotionData } from "./MultiplayerContext";
import { AuthContext } from "./AuthContext";
import { Msg } from "../../types/types";

interface GameContextProps {
  board: Square[][];
  highlight: (data: Data) => void;
  availablePositions: Position[];
  movePiece: (moveData: MoveData) => void;
  playerTurn: Player | null;
  isPromotion: boolean;
  promotePawn: (data: PromotionData) => void;
  checkmate: boolean;
  players: Player[];
  stalemate: boolean;
  getGameStatus: () => Promise<void>;
  gameId: string;
  updateGameState: (game: Game) => void;
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
  messages: Msg[];
  activePiece: Piece | null;
  drawOffered: boolean;
  setDrawOffered: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDrawOffer: React.Dispatch<React.SetStateAction<boolean>>;
  openDrawOffer: boolean;
}

export const GameContext = createContext<GameContextProps>({
  board: [],
  highlight: (data) => {},
  availablePositions: [],
  movePiece: (moveData) => {},
  playerTurn: null,
  isPromotion: false,
  promotePawn: (data) => {},
  checkmate: false,
  players: [],
  stalemate: false,
  getGameStatus: async () => {},
  gameId: "",
  updateGameState: (game) => {},
  setMessages: () => {},
  messages: [],
  activePiece: null,
  drawOffered: false,
  setDrawOffered: () => {},
  setOpenDrawOffer: () => {},
  openDrawOffer: false,
});

export const GameContextProvider = ({ children }: any) => {
  const { playSound } = useContext(SoundContext);
  const { loggedUserInfo } = useContext(AuthContext);
  const [gameId, setGameId] = useState("");
  const [board, setBoard] = useState<Square[][]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerTurn, setPlayerTurn] = useState<Player | null>(null);
  const [availablePositions, setAvailablePositions] = useState<Position[]>([]);
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const [isPromotion, setIsPromotion] = useState(false);
  const [checkPositions, setCheckPositions] = useState<Position[]>([]);
  const [checkmate, setCheckmate] = useState(false);
  const [lastMovePositions, setLastMovePositions] = useState<Position[]>([]);
  const [elPassantMove, setElPassantMove] = useState<Position | null>(null);
  const [elPassantCaptureMove, setElPassantCaptureMove] =
    useState<Position | null>(null);
  const [movedPieces, setMovedPieces] = useState<Piece[]>([]);
  const [stalemate, setStalemate] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [drawOffered, setDrawOffered] = useState(false);
  const [openDrawOffer, setOpenDrawOffer] = useState(false);

  useEffect(() => {
    const initGame = () => {
      const whitePlayer = new Player("white");
      const blackPlayer = new Player("black");

      //Create board
      const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          //importnant
          if (row === 6)
            board[row][col] = createPawn(row, col, "white", "pawn");
          if (row === 7) {
            if (col === 0)
              board[row][col] = createPawn(
                row,
                col,
                "white",
                "rook",
                "queenSide"
              );
            if (col === 7)
              board[row][col] = createPawn(
                row,
                col,
                "white",
                "rook",
                "kingSide"
              );
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
            if (col === 0)
              board[row][col] = createPawn(
                row,
                col,
                "black",
                "rook",
                "queenSide"
              );
            if (col === 7)
              board[row][col] = createPawn(
                row,
                col,
                "black",
                "rook",
                "kingSide"
              );
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

  const findAttackedPositions = (
    board: Square[][],
    pieceColor: string,
    exclude?: boolean
  ) => {
    let positionsUnderAttack: Position[] = [];

    board.flat().forEach((cell) => {
      if (cell !== null && cell instanceof Piece) {
        if (cell.color !== pieceColor) {
          if (cell.type === "pawn")
            positionsUnderAttack.push(...findPawnPositions(cell, board));
          if (cell.type === "knight")
            positionsUnderAttack.push(...findKnightPositions(cell, board));
          if (cell.type === "queen")
            positionsUnderAttack.push(...findQueenPositions(cell, board));
          if (cell.type === "bishop")
            positionsUnderAttack.push(...findBishopPositions(cell, board));
          if (cell.type === "rook")
            positionsUnderAttack.push(...findRookPositions(cell, board));
          if (cell.type === "king")
            positionsUnderAttack.push(...findKingPositions(cell, board));
        }
      }
    });

    return positionsUnderAttack;
  };

  const updateGameState = (game: Game) => {
    if (game.playerTurn?.playerData?.userId === loggedUserInfo?.userId) {
      setActivePiece(game.activePiece);
      setAvailablePositions(game.availablePositions);
    } else {
      setActivePiece(null);
      setAvailablePositions([]);
    }

    if (game.drawOffererId) {
      setDrawOffered(true);
      setOpenDrawOffer(true);
    } else {
      setOpenDrawOffer(false);
      setDrawOffered(false);
    }

    setMessages(game.messages);
    setBoard(game.board);
    setPlayers(game.players);
    setPlayerTurn(game.playerTurn);
    setIsPromotion(game.isPromotion);
    setCheckPositions(game.checkPositions);
    setCheckmate(game.checkmate);
    setLastMovePositions(game.lastMovePositions);
    setElPassantMove(game.elPassantMove);
    setElPassantCaptureMove(game.elPassantCaptureMove);
    setMovedPieces(game.movedPieces);
    setStalemate(game.stalemate);
    setGameId(game.gameId);
  };

  const getGameStatus = async () => {
    try {
      const response = await axios.get(
        " http://localhost:3000/api/game/retrieveGameStatus"
      );

      const game = response.data;
      updateGameState(game);
    } catch (error) {
      console.log(error);
    }
  };

  const findPositions = (
    board: Square[][],
    pieceColor: string,
    exclude?: boolean
  ) => {
    let positionsUnderAttack: Position[] = [];

    board.flat().forEach((cell) => {
      if (cell !== null) {
        if (cell.color !== pieceColor && cell instanceof Piece) {
          if (cell.type === "pawn")
            positionsUnderAttack.push(...highlightPawn(cell, board));
          if (cell.type === "knight")
            positionsUnderAttack.push(...highlightKnight(cell, board));
          if (cell.type === "queen")
            positionsUnderAttack.push(...highlightQueen(cell, board));
          if (cell.type === "bishop")
            positionsUnderAttack.push(...highlightBishop(cell, board));
          if (cell.type === "rook")
            positionsUnderAttack.push(...highlightRook(cell, board));
          if (cell.type === "king")
            positionsUnderAttack.push(...highlightKing(cell, board));
        }
      }
    });

    return positionsUnderAttack;
  };

  const findKing = (color: string) => {
    const king = board
      .flat()
      .find((piece) => piece?.type === "king" && piece.color === color);

    return king;
  };

  const switchTurns = () => {
    const nextPlayer = players.find(
      (player) => player.color !== playerTurn?.color
    );

    setPlayerTurn(nextPlayer!);
  };

  const elPassant = (piece: Piece, validMoves: Position[]) => {
    if (lastMovePositions.length > 0) {
      const enemyPieceType = lastMovePositions[0].type;
      const firstPosRow = lastMovePositions[0].row;
      const secondPosRow = lastMovePositions[1].row;
      const firstPosCol = lastMovePositions[0].col;
      const secondPosCol = lastMovePositions[1].col;
      let elPassantMove: Position | null = null;

      if (piece.color === "white") {
        if (
          enemyPieceType === "pawn" &&
          firstPosRow === 1 &&
          secondPosRow === 3 &&
          piece.position.row === 3 &&
          (secondPosCol - piece.position.col === 1 ||
            secondPosCol - piece.position.col === -1)
        ) {
          elPassantMove = {
            row: 2,
            col: firstPosCol,
          };

          setElPassantMove(elPassantMove);
          setElPassantCaptureMove(lastMovePositions[1]);
          validMoves.push(elPassantMove);
        }
      }

      if (piece.color === "black") {
        if (
          enemyPieceType === "pawn" &&
          firstPosRow === 6 &&
          secondPosRow === 4 &&
          piece.position.row === 4 &&
          (secondPosCol - piece.position.col === 1 ||
            secondPosCol - piece.position.col === -1)
        ) {
          elPassantMove = {
            row: 5,
            col: firstPosCol,
          };

          setElPassantMove(elPassantMove);
          setElPassantCaptureMove(lastMovePositions[1]);
          validMoves.push(elPassantMove);
        }
      }
    }

    return validMoves;
  };

  const findPawnPositions = (piece: Piece, board: Square[][]) => {
    let firstPos: Position | null = null;
    let secondPos: Position | null = null;
    let leftDiagonal: Position | null = null;
    let rightDiagonal: Position | null = null;
    let currentRow = piece.position.row;
    let currentCol = piece.position.col;
    let validMoves: Position[] = [];

    if (piece.color === "white") {
      firstPos = { row: currentRow - 1, col: currentCol, direction: "up" };
      secondPos = { row: currentRow - 2, col: currentCol, direction: "down" };
      leftDiagonal = {
        row: currentRow - 1,
        col: currentCol - 1,
        direction: "ld",
      };
      rightDiagonal = {
        row: currentRow - 1,
        col: currentCol + 1,
        direction: "rd",
      };

      if (board[currentRow - 1][currentCol] === null) validMoves.push(firstPos);

      if (
        currentRow === 6 &&
        board[currentRow - 1][currentCol] === null &&
        board[currentRow - 2][currentCol] === null
      ) {
        validMoves.push(secondPos);
      }

      if (
        board[currentRow - 1][currentCol + 1] !== null &&
        board[currentRow - 1][currentCol + 1]?.color !== piece.color
      ) {
        validMoves.push(rightDiagonal);
      }

      if (
        board[currentRow - 1][currentCol - 1] !== null &&
        board[currentRow - 1][currentCol - 1]?.color !== piece.color
      ) {
        validMoves.push(leftDiagonal);
      }

      //check for el passant
      validMoves = elPassant(piece, validMoves);
    }

    if (piece.color === "black") {
      firstPos = { row: currentRow + 1, col: currentCol, direction: "up" };
      secondPos = { row: currentRow + 2, col: currentCol, direction: "down" };
      rightDiagonal = {
        row: currentRow + 1,
        col: currentCol + 1,
        direction: "rd",
      };
      leftDiagonal = {
        row: currentRow + 1,
        col: currentCol - 1,
        direction: "ld",
      };

      if (board[currentRow + 1][currentCol] === null) {
        validMoves.push(firstPos);
      }

      if (
        currentRow === 1 &&
        board[currentRow + 1][currentCol] === null &&
        board[currentRow + 2][currentCol] === null
      ) {
        validMoves.push(secondPos);
      }

      if (
        board[currentRow + 1][currentCol + 1] !== null &&
        board[currentRow + 1][currentCol + 1]?.color !== piece.color
      ) {
        validMoves.push(rightDiagonal);
      }

      if (
        board[currentRow + 1][currentCol - 1] !== null &&
        board[currentRow + 1][currentCol - 1]?.color !== piece.color
      ) {
        validMoves.push(leftDiagonal);
      }

      //check for el passant
      validMoves = elPassant(piece, validMoves);
    }

    return validMoves;
  };

  const checkIsKingInDanger = (
    validMoves: Position[],
    piece: Piece,
    board: Square[][]
  ) => {
    const king = findKing(piece.color);
    const safeMoves: Position[] = [];

    board[piece.position.row][piece.position.col] = null;

    for (const move of validMoves) {
      const originalPiece = board[move.row][move.col];
      board[move.row][move.col] = piece;

      let attackedPositions = findAttackedPositions(board, piece.color);

      const kingInDanger = attackedPositions.some(
        (attackPos) =>
          attackPos.row === king?.position.row &&
          attackPos.col === king?.position.col
      );

      if (!kingInDanger) {
        safeMoves.push(move);
      }

      board[move.row][move.col] = originalPiece;
    }

    return safeMoves;
  };

  const highlightPawn = (piece: Piece, newBoard: Square[][]) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findPawnPositions(piece, board);

    //validate positions
    validMoves = checkIsKingInDanger(validMoves, piece, board);

    return validMoves;
  };

  const findKnightPositions = (piece: Piece, board: Square[][]) => {
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
        if (!board[r][c] || board[r][c]?.color !== piece?.color) {
          validMoves.push({ row: r, col: c, direction: move.direction });
        }
      }
    });

    return validMoves;
  };

  const highlightKnight = (
    piece: Piece,

    newBoard: Square[][]
  ) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findKnightPositions(piece, board);

    validMoves = checkIsKingInDanger(validMoves, piece, board);

    return validMoves;
  };

  const findBishopPositions = (piece: Piece, board: Square[][]) => {
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
            (board[r][c]?.color === "black" && piece.color === "white") ||
            (board[r][c]?.color === "white" && piece.color === "black")
          ) {
            validMoves.push({ row: r, col: c, direction: direction.direction });
          }
          break;
        }
        r += direction.row;
        c += direction.col;
      }
    });

    return validMoves;
  };

  const highlightBishop = (piece: Piece, newBoard: Square[][]) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findBishopPositions(piece, board);

    validMoves = checkIsKingInDanger(validMoves, piece, board);

    return validMoves;
  };

  const findRookPositions = (piece: Piece, board: Square[][]) => {
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

    return validMoves;
  };

  const highlightRook = (piece: Piece, newBoard: Square[][]) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findRookPositions(piece, board);

    validMoves = checkIsKingInDanger(validMoves, piece, board);

    return validMoves;
  };

  const findQueenPositions = (piece: Piece, board: Square[][]) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

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

    return validMoves;
  };

  const highlightQueen = (
    piece: Piece,

    newBoard: Square[][]
  ) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findQueenPositions(piece, board);

    validMoves = checkIsKingInDanger(validMoves, piece, board);

    return validMoves;
  };

  const findKingPositions = (piece: Piece, board: Square[][]) => {
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
        if (board[r][c] === null || board[r][c]?.color !== piece.color) {
          validMoves.push({ row: r, col: c, direction: move.direction });
        }
      }
    });

    return validMoves;
  };

  const castling = (safeMoves: Position[], piece: Piece, board: Square[][]) => {
    let kingRightPositionRow: null | number = null;
    let kingRightPositionCol = 5;
    let rightSideCastlingPositionRow: null | number = null;
    let rightSideCastlingPositionCol = 6;
    let rightCastleMove: null | Position = null;

    let leftSideCastlingPositions: Position[] = [];
    let kingLeftPositionRow: null | number = null;
    let kingLeftPositionCol = 3;
    let leftCastleMove: null | Position = null;

    //check if the king already moved and if yes then return from func
    let kingMoved = movedPieces.find(
      (movedPiece) =>
        movedPiece.color === piece.color && movedPiece.type === "king"
    );

    if (kingMoved) return safeMoves;

    if (piece.color === "white") {
      kingRightPositionRow = 7;
      rightSideCastlingPositionRow = 7;
      rightCastleMove = { row: 7, col: 6 };

      leftSideCastlingPositions = [
        { row: 7, col: 1 },
        { row: 7, col: 2 },
        { row: 7, col: 3 },
      ];
      kingLeftPositionRow = 7;
      leftCastleMove = { row: 7, col: 2 };
    }

    if (piece.color === "black") {
      kingRightPositionRow = 0;
      rightSideCastlingPositionRow = 0;
      rightCastleMove = { row: 0, col: 6 };

      leftSideCastlingPositions = [
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
      ];

      kingLeftPositionRow = 0;
      leftCastleMove = { row: 0, col: 2 };
    }

    //check if any of these positions are under attack
    let attackedPositions = findAttackedPositions(board, piece.color);

    //right side logic (king side)

    //check if the right side rook moved
    const rightSideRook = movedPieces.find(
      (movedPiece) =>
        movedPiece.side === "kingSide" &&
        movedPiece.color === piece.color &&
        movedPiece.type === "rook"
    );

    if (!rightSideRook) {
      //check if the king is safe to move to the right
      const kingCanMoveRight = safeMoves.some(
        (move) =>
          move.row === kingRightPositionRow && move.col === kingRightPositionCol
      );

      //check if that castling positions is under attack
      let positionUnderAttack = attackedPositions.some(
        (attackedPos) =>
          attackedPos.row === rightSideCastlingPositionRow &&
          attackedPos.col === rightSideCastlingPositionCol
      );

      //check if there is a piece on a right castling position
      if (
        board[rightSideCastlingPositionRow!][rightSideCastlingPositionCol!] ===
          null &&
        positionUnderAttack === false &&
        kingCanMoveRight
      ) {
        safeMoves.push(rightCastleMove!);
      }
    }

    //left side logic (queen side)

    //check if there is any piece on these positions
    const positionsNotFree = leftSideCastlingPositions.some(
      (position) => board[position.row][position.col] !== null
    );

    if (positionsNotFree) return safeMoves;

    //check if the left side rook moved
    const leftSideRook = movedPieces.find(
      (movedPiece) =>
        movedPiece.side === "queenSide" &&
        movedPiece.color === piece.color &&
        movedPiece.type === "rook"
    );

    //if it moved we just return
    if (leftSideRook) return safeMoves;

    //check if the king is safe to move to left
    const kingCanMoveLeft = safeMoves.some(
      (move) =>
        move.row === kingLeftPositionRow && move.col === kingLeftPositionCol
    );

    leftSideCastlingPositions = leftSideCastlingPositions.filter((move) => {
      let positionUnderAttack = !attackedPositions.some(
        (attackPos) => move.row === attackPos.row && move.col === attackPos.col
      );

      return positionUnderAttack;
    });

    if (leftSideCastlingPositions.length === 3 && kingCanMoveLeft) {
      safeMoves.push(leftCastleMove!);
    }

    return safeMoves;
  };

  const highlightKing = (piece: Piece, newBoard: Square[][]) => {
    let board = _.cloneDeep(newBoard);
    const validMoves = findKingPositions(piece, board);
    let safeMoves: Position[] = [];

    board[piece.position.row][piece.position.col] = null;

    for (const move of validMoves) {
      const originalPiece = board[move.row][move.col];
      board[move.row][move.col] = piece;

      const attackedPositions = findAttackedPositions(board, piece.color);

      const isKingThreatened = attackedPositions.some(
        (attackPos) => attackPos.row === move.row && attackPos.col === move.col
      );

      if (!isKingThreatened) {
        safeMoves.push(move);
      }

      board[move.row][move.col] = originalPiece;
    }

    board[piece.position.row][piece.position.col] = piece;

    //check for castling moves
    safeMoves = castling(safeMoves, piece, board);

    return safeMoves;
  };

  const determineCheckmate = (board: Square[][], activePiece: Piece) => {
    let availablePositions: Position[] = [];
    const enemyColor = players.find(
      (player) => player.color !== playerTurn?.color
    )?.color;

    //finds availablePositions for a piece that just moved to a new square
    switch (activePiece?.type) {
      case "pawn":
        availablePositions = highlightPawn(activePiece, board);
        break;
      case "knight":
        availablePositions = highlightKnight(activePiece, board);
        break;
      case "queen":
        availablePositions = highlightQueen(activePiece, board);
        break;
      case "bishop":
        availablePositions = highlightBishop(activePiece, board);
        break;
      case "rook":
        availablePositions = highlightRook(activePiece, board);
        break;
      case "king":
        availablePositions = highlightKing(activePiece, board);
        break;
    }

    //find the position of enemy king
    const enemyKing = findKing(enemyColor!);

    //find if the enemy king is in available positions (if it is that means its a checkmate)
    const kingInCheck = availablePositions.find(
      (position) =>
        position.row === enemyKing?.position.row &&
        position.col === enemyKing.position.col
    );

    //this will find all possible enemy positions
    let enemyAttackPositions = findPositions(board, playerTurn?.color!);

    //this is stalemate
    if (!kingInCheck && enemyAttackPositions.length === 0) {
      setStalemate(true);
      return false;
    }

    //no check
    if (!kingInCheck) return false;

    //Now we need to find a path which lead to enemy king (checkPositions)
    let checkPositions: Position[] = availablePositions.filter(
      (position) => position.direction === kingInCheck?.direction
    );
    //include the active piece in checkPositions
    checkPositions.push(activePiece!.position);

    //this finds all possible king positions
    let kingPositions = highlightKing(enemyKing!, board);

    let positionsThatBlockCheck: Position[] = [];

    //we have to iterate throught all the enemy positions and check

    // if we can find any of those positions in our checkPositions (that means enemy can block the check)
    checkPositions.forEach((checkPos) => {
      let position = enemyAttackPositions.find(
        (enemyPos) =>
          enemyPos.col === checkPos.col && enemyPos.row === checkPos.row
      );

      if (position) positionsThatBlockCheck.push(position);
    });

    if (positionsThatBlockCheck.length === 0 && kingPositions.length === 0) {
      setCheckmate(true);
      return true;
    }

    return false;
  };

  const promotePawn = (data: PromotionData) => {
    let newActivePiece: Piece | null = null;
    const type = data.type;
    const row = activePiece?.position.row;
    const col = activePiece?.position.col;
    const color = activePiece?.color;
    let newBoard = _.cloneDeep(board);

    if (type === "queen") {
      newActivePiece = createPawn(row!, col!, color!, "queen");
      newBoard[row!][col!] = newActivePiece;
    }

    if (type === "knight") {
      newActivePiece = createPawn(row!, col!, color!, "knight");
      newBoard[row!][col!] = createPawn(row!, col!, color!, "knight");
    }

    if (type === "rook") {
      newActivePiece = createPawn(row!, col!, color!, "rook");
      newBoard[row!][col!] = newActivePiece;
    }

    if (type === "bishop") {
      newActivePiece = createPawn(row!, col!, color!, "bishop");
      newBoard[row!][col!] = createPawn(row!, col!, color!, "bishop");
    }

    const isCheckmate = determineCheckmate(newBoard, newActivePiece!);

    setBoard(newBoard);
    setIsPromotion(false);
    isCheckmate === false && switchTurns();
  };

  const movePiece = (moveData: MoveData) => {
    let updatedActivePiece = _.cloneDeep(activePiece);
    let updatedBoard = _.cloneDeep(board);
    let promotion = false;
    const row = moveData.row;
    const col = moveData.col;
    const currentPlayerIndex = players.findIndex(
      (player) => player.color === activePiece?.color
    );
    const updatedPlayers = [...players];
    setCheckPositions([]);
    playSound(move);

    if (!activePiece) return;

    let initialPosition = {
      row: activePiece.position.row,
      col: activePiece.position.col,
      type: activePiece.type,
    };
    let desiredPosition = {
      row: row,
      col: col,
      type: activePiece.type,
    };

    setLastMovePositions([initialPosition, desiredPosition]);

    //moving piece logic
    updatedBoard[activePiece.position.row][activePiece.position.col] = null;
    updatedActivePiece!.position.row = row;
    updatedActivePiece!.position.col = col;

    //moving piece logic if it is a castling move

    //check if the king already moved
    const kingMoved = movedPieces.find(
      (movedPiece) =>
        movedPiece.type === "king" && movedPiece.color === activePiece.color
    );

    //if the piece is king and it did not move then we can castle
    if (activePiece.type === "king" && !kingMoved) {
      //now we have to move the rook based on a king position

      //this is left side castling (queen side)
      if ((row === 0 && col === 2) || (row === 7 && col === 2)) {
        //move the rook one position after this
        const rook = updatedBoard[row][col - 2];
        updatedBoard[row][col - 2] = null;
        rook!.position.row = row;
        rook!.position.col = col + 1;
        updatedBoard[row][col + 1] = rook;
      }

      //this is right side castling (king side)
      if ((row === 0 && col === 6) || (row === 7 && col === 6)) {
        const rook = updatedBoard[row][col + 1];
        updatedBoard[row][col + 1] = null;
        rook!.position.row = row;
        rook!.position.col = col - 1;
        updatedBoard[row][col - 1] = rook;
      }
    }

    //enemy peace that was eaten
    const enemyPiece = updatedBoard[row][col];

    if (enemyPiece) {
      updatedPlayers[currentPlayerIndex].enemyPieces.push(enemyPiece);
      setPlayers(updatedPlayers);
    }

    updatedBoard[row][col] = updatedActivePiece;

    //eating a pawn if it is el passant
    if (
      elPassantMove &&
      elPassantMove?.row === row &&
      elPassantMove.col === col
    ) {
      const piece =
        updatedBoard[elPassantCaptureMove?.row!][elPassantCaptureMove?.col!];

      updatedBoard[elPassantCaptureMove!.row][elPassantCaptureMove!.col] = null;
      updatedPlayers[currentPlayerIndex].enemyPieces.push(piece!);
      setPlayers(updatedPlayers);
    }

    //determine if it is a promotion
    if (activePiece.type === "pawn" && (row === 7 || row === 0)) {
      setIsPromotion(true);
      promotion = true;
    }

    //determine if it is a check or checkmate
    let isCheckmate =
      promotion === false &&
      determineCheckmate(updatedBoard, updatedActivePiece!);

    setMovedPieces((prev) => [...prev, updatedActivePiece!]);

    if (promotion === true) setActivePiece(updatedActivePiece);

    if (promotion === false) setActivePiece(null);

    if (promotion === false && isCheckmate === false) switchTurns();
    setAvailablePositions([]);
    setBoard(updatedBoard);
    setElPassantMove(null);
  };

  const highlight = (data: Data) => {
    const piece = data.piece;

    if (piece.type === "pawn")
      setAvailablePositions(highlightPawn(piece, board));

    if (piece.type === "rook")
      setAvailablePositions(highlightRook(piece, board));

    if (piece.type === "knight")
      setAvailablePositions(highlightKnight(piece, board));

    if (piece.type === "bishop")
      setAvailablePositions(highlightBishop(piece, board));

    if (piece.type === "king")
      setAvailablePositions(highlightKing(piece, board));

    if (piece.type === "queen")
      setAvailablePositions(highlightQueen(piece, board));

    setActivePiece(piece);
  };

  const contextValue: GameContextProps = {
    board,
    highlight,
    availablePositions,
    movePiece,
    playerTurn,
    checkmate,
    isPromotion,
    promotePawn,
    players,
    stalemate,
    getGameStatus,
    gameId,
    updateGameState,
    messages,
    setMessages,
    activePiece,
    drawOffered,
    setDrawOffered,
    setOpenDrawOffer,
    openDrawOffer,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
