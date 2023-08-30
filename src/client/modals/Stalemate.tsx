import React from "react";

const Stalemate = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col px-10 py-5 bg-white border rounded-lg shadow-lg">
        <div className="text-center">
          <h2>Draw!</h2>
          <span>by stalemate</span>
        </div>
        <button className="p-1 mt-2 text-xl font-normal text-white rounded-md bg-amber-900">
          Next
        </button>
      </div>
    </div>
  );
};

export default Stalemate;
