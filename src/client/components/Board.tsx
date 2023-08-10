import React, { useEffect, useState } from "react";
import classNames from "classnames";

const Board = () => {
  const [board, setBoard] = useState<number[][]>([]);

  console.log(board);

  useEffect(() => {
    const createBoard = () => {
      const board = [];

      for (let i = 1; i < 9; i++) {
        let row = [];

        for (let j = 1; j < 9; j++) {
          row.push(j);
        }
        board.push(row);
      }

      setBoard(board);
    };

    createBoard();
  }, []);

  return (
    <section className="flex items-center justify-center h-[100vh]">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={classNames("w-20 h-20", {
                "bg-green-700":
                  (cell % 2 !== 0 && (rowIndex + 1) % 2 === 0) ||
                  (cell % 2 === 0 && (rowIndex + 1) % 2 !== 0),
                "bg-green-200":
                  (cell % 2 !== 0 && (rowIndex + 1) % 2 !== 0) ||
                  (cell % 2 === 0 && (rowIndex + 1) % 2 === 0),
              })}
            >
              {/* {`${cell}-${rowIndex + 1}`} */}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default Board;
