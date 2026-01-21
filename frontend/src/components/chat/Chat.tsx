import { useEffect, useRef } from "react";
import ChatPlaceholder from "./ChatPlaceholder";
import ChatMessage from "./ChatMessage";
import { useChat } from "@/contexts/ChatContext";
import LotusChatHeader from "./LotusChatHeader";
import Alerta from "../alerta/Alerta";

const Chat = () => {
  const { chat, isThinking } = useChat();
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
      <span className="pointer-events-none absolute inset-x-0 top-0 z-900 h-20 bg-linear-to-b from-[#111111] to-transparent" />

      <div ref={chatScrollRef} className="h-full overflow-y-auto">
        <div className="flex min-h-full flex-col justify-end gap-2 pt-15">
          {chat.map((e, index) =>
            e.type === "error" ? (
              <Alerta
                alerta={{
                  tipo: "erro",
                  mensagem: "Não foi possível enviar a mensagem",
                }}
              />
            ) : (
              <ChatMessage key={index} message={e} />
            ),
          )}

          {isThinking && <LotusChatHeader isThinking={isThinking} />}
        </div>
      </div>
    </div>
  ) : (
    <ChatPlaceholder />
  );
};

export default Chat;
