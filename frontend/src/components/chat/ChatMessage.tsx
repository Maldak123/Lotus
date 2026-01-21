import type { MessageResponse } from "@/types/Mensagem";
import ReactMarkdown from "react-markdown";
import LotusChatHeader from "./LotusChatHeader";

interface ChatMessageProps {
  message: MessageResponse;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const humanClasses =
    "bg-[#292929] rounded-tr-xs self-end text-[rgba(255,255,255,0.75)]";
  const systemClasses =
    "bg-[rgba(255,255,255,0.75)] text-[#1e1e1e] rounded-tl-xs self-start ml-7";

  return (
    <>
      {message.type === "ai" && <LotusChatHeader />}
      <div
        className={`max-w-3/4 rounded-xl p-4 wrap-break-word ${message.type === "human" ? humanClasses : systemClasses}`}
      >
        <div className="w-full text-wrap whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              pre: ({ node, ...props }) => (
                <div className="my-2 w-full rounded bg-[#111] p-4 wrap-break-word whitespace-pre-wrap text-[rgba(255,255,255,0.75)]">
                  <pre
                    {...props}
                    className="wrap-break-word whitespace-pre-wrap"
                  />
                </div>
              ),
              code: ({ node, ...props }) => (
                <code
                  className="wrap-break-word whitespace-pre-wrap"
                  {...props}
                />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
