import React from "react";
import { SendHorizontal } from "lucide-react";

interface SubmitButtonProps {
  enviar: () => void;
}

const SubmitButton = ({ enviar }: SubmitButtonProps) => {
  return (
    <>
      <button
        onClick={enviar}
        className="group flex cursor-pointer items-center justify-center rounded-md bg-[#1e1e1e] p-2 transition-colors hover:bg-[rgba(255,255,255,0.75)] lg:size-16"
      >
        <SendHorizontal className="text-[rgba(255,255,255,0.75)] transition-colors group-hover:text-[#1e1e1e] lg:scale-120" />
      </button>
    </>
  );
};

export default SubmitButton;
