import React from "react";

interface Props {
  setOpenDrawModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Draw = ({ setOpenDrawModal }: Props) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center text-black justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="z-40 flex flex-col items-center justify-center px-[3rem] md:px-0 md:w-[20rem] py-5 mx-2 space-y-4 bg-amber-100 rounded-md shadow-xl">
        <h2 className="text-xl">Game ended in draw!</h2>

        <button
          onClick={() => {
            setOpenDrawModal(false);
          }}
          className="px-5 py-1 text-xl font-normal text-white border-2 rounded-md border-amber-900 bg-amber-900 hover:bg-transparent hover:text-amber-900"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Draw;
