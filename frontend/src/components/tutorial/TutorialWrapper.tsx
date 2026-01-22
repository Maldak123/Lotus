import React, { useState } from "react";

interface TutorialWrapperProps {
  setTutorialDone: React.Dispatch<React.SetStateAction<string | null>>;
}

const TutorialWrapper = ({ setTutorialDone }: TutorialWrapperProps) => {
  const [page, setPage] = useState(0);

  const handleNext = () => {
    switch (page) {
      case 0:
      case 1:
      case 2:
        setPage(page + 1);
        break;
      default:
        localStorage.setItem("tutorialDone", "done");
        setTutorialDone("done");
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-[#111]">
      <p className="text-4xl text-white">Tutorial</p>
      <button className="cursor-pointer bg-blue-500 p-2" onClick={handleNext}>
        {page <= 2 ? "Próximo" : "Começar"}
      </button>
    </div>
  );
};

export default TutorialWrapper;
