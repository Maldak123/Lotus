const API_URL = import.meta.env.VITE_API_URL;

export const enviarChat = async (mensagem: string) => {
  const response = await fetch(`${API_URL}/chat/sendmessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mensagem: mensagem }),
  });

  return await response.json()
};