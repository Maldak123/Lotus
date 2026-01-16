import Logo from "../logo/Logo";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  sender: string;
  mensagem: string;
}

const ChatMessage = ({ sender, mensagem }: ChatMessageProps) => {
  const humanClasses =
    "bg-[#292929] rounded-tr-xs self-end text-[rgba(255,255,255,0.75)]";
  const systemClasses =
    "bg-[rgba(255,255,255,0.75)] text-[#1e1e1e] rounded-tl-xs self-start ml-7";

  return (
    <>
      {sender !== "human" && (
        <div className="flex items-start gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#1e1e1e]">
              <Logo size={2} />
          </div>
          <p className="text text-white">Lotus</p>
        </div>
      )}
      <div
        className={`max-w-3/4 rounded-xl p-4 wrap-break-word ${sender === "human" ? humanClasses : systemClasses}`}
      >
        <div className="w-full text-wrap whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              pre: ({ node, ...props }) => (
                <div className="my-2 w-full rounded bg-[#111] p-4 wrap-break-word whitespace-pre-wrap text-[rgba(255,255,255,0.75)]">
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