import Logo from "../logo/Logo";

const ChatPlaceholder = () => {
  return (
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="opacity-50">
          <Logo size={7} animated={true} infinite={true} />
        </div>

        <h1 className="text-6xl font-extralight text-[rgba(255,255,255,0.75)]">
          Lotus
        </h1>

        <p className="text-[rgba(255,255,255,0.5)] px-6 text-center">
          Envie seus arquivos, e deixe que a Lotus lhe responda.
        </p>
      </div>
    </div>
  );
};

export default ChatPlaceholder;
