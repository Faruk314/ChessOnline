import React, { useContext } from "react";
import blackRook from "../assets/images/rook_b.png";
import blackKnight from "../assets/images/knight_b.png";
import blackBishop from "../assets/images/bishop_b .png";
import blackQueen from "../assets/images/queen_b.png";

import whiteRook from "../assets/images/rook_w.png";
import whiteKnight from "../assets/images/knight_w.png";
import whiteBishop from "../assets/images/bishop_w.png";
import whiteQueen from "../assets/images/queen_w.png";
import { GameContext } from "../context/GameContext";

interface Props {
  color: string;
}

const Promotion = ({ color }: Props) => {
  return <div className="fixed p-2 border border-black bottom-10"></div>;
};

export default Promotion;
