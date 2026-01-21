import type { MessageResponse } from "@/types/Mensagem";
import React, { createContext, useContext, useState } from "react";

interface ChatContextProps {
  chat: MessageResponse[];
  setChat: React.Dispatch<React.SetStateAction<MessageResponse[]>>;
  isThinking: boolean;
  setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatContext = createContext<ChatContextProps>({
  chat: [],
  setChat: () => {},
  isThinking: false,
  setIsThinking: () => {},
});

export default function ChatProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [chat, setChat] = useState<MessageResponse[]>([]);
  const [isThinking, setIsThinking] = useState(false)

  return (
    <ChatContext.Provider value={{ chat, setChat, isThinking, setIsThinking }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
