import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";
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

  const pRef = useRef(null);

  return (
    <>
      {sender !== "user" && (
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
        className={`max-w-3/4 rounded-xl p-4 wrap-break-word ${sender === "user" ? userClasses : systemClasses}`}
      >
        <div className="w-full text-wrap whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              pre: ({ node, ...props }) => (
                <div className="my-2 w-full rounded bg-[#111] p-4 wrap-break-word whitespace-pre-wrap text-[rgba(255,255,255,0.75)]">
                  {/* Adicionei as classes na tag 'pre' abaixo para garantir a sobreposição do padrão do navegador */}
                  <pre {...props} className="wrap-break-word whitespace-pre-wrap" />
                </div>
              ),
              code: ({ node, ...props }) => (
                <code className="wrap-break-word whitespace-pre-wrap" {...props} />
              ),
            }}
          >
            {mensagem}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
