interface TutorialButtonsProps {
  handleNext: () => void;
  handleSkip: () => void;
  page: number;
}

const TutorialButtons = ({
  handleNext,
  handleSkip,
  page,
}: TutorialButtonsProps) => {
  return (
    <div className="flex justify-between">
      <button
        onClick={handleSkip}
        className="cursor-pointer text-white underline opacity-25"
      >
        Pular Guia
      </button>

      <button
        className="h-min cursor-pointer self-center justify-self-end bg-[rgba(255,255,255,0.25)] px-5 py-3 text-[rgba(255,255,255,0.75)] hover:bg-transparent hover:border hover:border-white transition-colors duration-300"
        onClick={handleNext}
      >
        {page < 2 ? "Próximo" : "Começar"}
      </button>
    </div>
  );
};

export default TutorialButtons;
