import type { Mensagem } from "@/types/Mensagem";

const API_URL = import.meta.env.VITE_API_URL;

export const enviarChat = async (mensagem: Mensagem) => {
  const response = await fetch(`${API_URL}/chat/sendmessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: mensagem.sender,
      mensagem: mensagem.mensagem,
    }),
  });

  return await response.json();
};
