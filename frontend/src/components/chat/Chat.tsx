import React, { useState } from "react";
import ChatMessage from "./ChatMessage";

interface Mensagem{
  sender: string
  mensagem: string
}

const Chat = () => {
  const [newMessages, setNewMessages] = useState<Mensagem[]>([]);

  return (
    <div className="relative h-full">
      <span className="pointer-events-none absolute inset-x-0 top-0 z-999 h-40 bg-linear-to-b from-[#111111] to-transparent" />

      <div className="h-full overflow-y-auto">
        <div className="flex min-h-full flex-col justify-end gap-2 pt-15">
          {newMessages.map((e, index) => (
            <ChatMessage key={index} sender={e.sender} mensagem={e.mensagem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
