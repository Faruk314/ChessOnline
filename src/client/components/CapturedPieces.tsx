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

import { Piece } from "../../types/types";

interface Props {
  capturedPieces: Piece[];
}

const pieceImages = {
  pawn: { white: whitePawn, black: blackPawn },
  rook: { white: whiteRook, black: blackRook },
  knight: { white: whiteKnight, black: blackKnight },
  bishop: { white: whiteBishop, black: blackBishop },
  queen: { white: whiteQueen, black: blackQueen },
  king: { white: whiteKing, black: blackKing },
} as const;

const CapturedPieces = ({ capturedPieces }: Props) => {
  const { pawns, rooks, knights, bishops, queen, king } = capturedPieces.reduce(
    (acc, piece) => {
      switch (piece.type) {
        case "pawn":
          acc.pawns.push(piece);
          break;
        case "rook":
          acc.rooks.push(piece);
          break;
        case "knight":
          acc.knights.push(piece);
          break;
        case "bishop":
          acc.bishops.push(piece);
          break;
        case "queen":
          acc.queen = piece;
          break;
        case "king":
          acc.king = piece;
          break;
      }
      return acc;
    },
    {
      pawns: [] as Piece[],
      rooks: [] as Piece[],
      knights: [] as Piece[],
      bishops: [] as Piece[],
      queen: null as Piece | null,
      king: null as Piece | null,
    }
  ) ?? {
    pawns: [],
    rooks: [],
    knights: [],
    bishops: [],
    queen: null,
    king: null,
  };

  return (
    <div className="flex flex-wrap items-center gap-1 min-h-[1.25rem]">
      {(
        [
          ["pawn", pawns],
          ["rook", rooks],
          ["knight", knights],
          ["bishop", bishops],
        ] as const
      ).map(
        ([type, pieces]) =>
          pieces.length > 0 && (
            <div key={type} className="flex -space-x-2 md:-space-x-2.5">
              {pieces.map((piece, i) => (
                <img
                  key={`${type}-${i}`}
                  src={pieceImages[type][piece.color]}
                  alt={type}
                  className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-sm"
                />
              ))}
            </div>
          )
      )}

      {queen && (
        <img
          src={pieceImages.queen[queen.color]}
          alt="queen"
          className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-sm ml-1"
        />
      )}

      {king && (
        <img
          src={pieceImages.king[king.color]}
          alt="king"
          className="w-4 h-4 md:w-5 md:h-5 object-contain drop-shadow-sm ml-1"
        />
      )}
    </div>
  );
};

export default CapturedPieces;
