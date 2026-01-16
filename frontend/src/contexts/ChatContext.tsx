import type { MessageResponse } from "@/types/Mensagem";
import React, { createContext, useContext, useState } from "react";

interface ChatContextProps {
  chat: MessageResponse[];
  setChat: React.Dispatch<React.SetStateAction<MessageResponse[]>>;
}

export const ChatContext = createContext<ChatContextProps>({
  chat: [],
  setChat: () => {},
});

export default function ChatProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [chat, setChat] = useState<MessageResponse[]>([]);

  return (
    <ChatContext.Provider value={{ chat, setChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
