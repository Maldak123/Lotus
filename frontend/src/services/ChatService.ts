import type { MessageResponse } from "@/types/Mensagem";

const API_URL = import.meta.env.VITE_API_URL;

export const enviarChat = async (mensagem: MessageResponse) => {
  const response = await fetch(`${API_URL}/chat/sendmessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionStorage.getItem("sessionId"),
      type:"user",
      content: mensagem.content,
      filenames: mensagem.filenames,
    }),
  });

  return await response.json();
};

export const getSessionMessages = async (session_id: string) => {
  const response = await fetch(`${API_URL}/chat/getsession/${session_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "8000",
    },
  });

  return await response.json();
};
