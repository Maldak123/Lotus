import React, { useEffect, useRef } from "react";
import ChatPlaceholder from "./ChatPlaceholder";
import ChatMessage from "./ChatMessage";
import { useChat } from "@/contexts/ChatContext";

const Chat = () => {
  const { chat } = useChat();
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollDiv = chatScrollRef.current;
    if (scrollDiv && scrollDiv.scrollHeight > scrollDiv.clientHeight) {
      scrollDiv.scrollTo({
        top: scrollDiv.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat]);

  return chat.length > 0 ? (
    <div className="relative h-full">
      <span className="pointer-events-none absolute inset-x-0 top-0 z-999 h-40 bg-linear-to-b from-[#111111] to-transparent" />

      <div ref={chatScrollRef} className="h-full overflow-y-auto">
        <div className="flex min-h-full flex-col justify-end gap-2 pt-15">
          {chat.map((e, index) => (
            <ChatMessage key={index} sender={e.sender} mensagem={e.mensagem} />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <ChatPlaceholder />
  );
};

export default Chat;
