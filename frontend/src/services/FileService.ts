import { v4 as uuidv4 } from "uuid";
const API_URL = import.meta.env.VITE_API_URL;

export const enviarArquivos = async (arquivo: File) => {
  if (!sessionStorage.getItem("sessionId")) {
    return { status: 400, detail: "sessionID não presente na sessão." };
  }

  const session_id = sessionStorage.getItem("sessionId") || "";
  const formData = new FormData();
  const idUnico = uuidv4();

  formData.append("file_id", idUnico);
  formData.append("session", session_id);
  formData.append("file", arquivo);

  const response = await fetch(`${API_URL}/files/sendfiles`, {
    method: "POST",
    body: formData,
  });

  return await response.json();
};

export const apagarArquivo = async (file_id: string, session_id: string) => {
  const response = await fetch(`${API_URL}/files/removefile`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_id: file_id, session_id: session_id }),
  });

  return await response.json();
};

export const getStatusFile = async (file_id: string) => {
  const response = await fetch(`${API_URL}/files/getfile/${file_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "8000"
    },
  });

  return await response.json();
};
