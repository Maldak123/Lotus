import React, { useState } from "react";
import TutorialHeader from "./TutorialHeader";
import TutorialOne from "./tutorialPages/TutorialOne";
import TutorialButtons from "./TutorialButtons";
import TutorialTwo from "./tutorialPages/TutorialTwo";
import TutorialThree from "./tutorialPages/TutorialThree";

interface TutorialWrapperProps {
  setTutorialDone: React.Dispatch<React.SetStateAction<string | null>>;
}

const TutorialWrapper = ({ setTutorialDone }: TutorialWrapperProps) => {
  const [page, setPage] = useState(0);

  const renderTutorialPage = () => {
    switch (page) {
      case 0:
        return <TutorialOne />;
      case 1:
        return <TutorialTwo />;
      case 2:
        return <TutorialThree />
    }
  };

  const handleNext = () => {
    switch (page) {
      case 0:
      case 1:
        setPage(page + 1);
        break;
      default:
        localStorage.setItem("tutorialDone", "done");
        setTutorialDone("done");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("tutorialDone", "done");
    setTutorialDone("done");
  };

  return (
    <div className="row-[1fr_1fr_1fr] grid gap-2 h-full w-full bg-[#111] p-6 md:max-w-6/10">
      <TutorialHeader />

      <div className="flex items-center overflow-y-scroll ">{renderTutorialPage()}</div>

      <TutorialButtons
        handleNext={handleNext}
        handleSkip={handleSkip}
        page={page}
      />
    </div>
  );
};

export default TutorialWrapper;
