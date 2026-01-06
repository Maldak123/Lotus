import React from "react";
import LogoAnimated from "../logoAnimated/Logo";

interface ChatMessageProps {
  sender: string;
  mensagem: string;
}

const ChatMessage = ({ sender, mensagem }: ChatMessageProps) => {
  const userClasses =
    "bg-[#292929] rounded-tr-xs self-end text-[rgba(255,255,255,0.75)]";
  const systemClasses =
    "bg-[rgba(255,255,255,0.75)] text-[#1e1e1e] rounded-tl-xs self-start ml-7";

  return (
    <>
      {sender === "system" && (
        <div className="flex items-start gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#1e1e1e]">
            <div className="scale-60">
              <LogoAnimated />
            </div>
          </div>
          <p className="text text-white">Lotus</p>
        </div>
      )}
      <div
        className={`max-w-3/4 rounded-xl p-3 wrap-break-word ${sender === "user" ? userClasses : systemClasses}`}
      >
        <p className="whitespace-pre-wrap">{mensagem}</p>
      </div>
    </>
  );
};

export default ChatMessage;
