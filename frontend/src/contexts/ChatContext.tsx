import type { Mensagem } from "@/types/Mensagem";
import React, { createContext, useContext, useState } from "react";

interface ChatContextType {
  chat: Mensagem[];
  setChat: React.Dispatch<React.SetStateAction<Mensagem[]>>;
}

export const ChatContext = createContext<ChatContextType>({
  chat: [],
  setChat: () => {},
});

export default function ChatProvider({
  children,
}: {
  children: React.ReactElement[];
}) {
  const [chat, setChat] = useState<Mensagem[]>([]);

  return (
    <ChatContext.Provider value={{ chat, setChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
