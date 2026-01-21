import Logo from "../logo/Logo";

interface LotusChatHeaderProps {
  isThinking?: boolean;
}

const LotusChatHeader = ({ isThinking }: LotusChatHeaderProps) => {
  return (
    <div className="flex items-start gap-2">
      <div className="flex size-10 items-center justify-center rounded-full bg-[#1e1e1e]">
        <Logo size={2} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text text-white">Lotus</p>
        {isThinking && <p>Pensando...</p>}
      </div>
    </div>
  );
};

export default LotusChatHeader;
