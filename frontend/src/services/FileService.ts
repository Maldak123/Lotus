import { v4 as uuidv4 } from "uuid";
const API_URL = import.meta.env.VITE_API_URL;

export const enviarArquivos = async (arquivos: File[]) => {
  const respostas = [];

  for (const arq of arquivos) {
    const formData = new FormData();
    const idUnico = uuidv4();

    formData.append("id_arquivo", idUnico);
    formData.append("sessao", sessionStorage.getItem('sessaoId') || "teste");
    formData.append("file", arq);

    const response = await fetch(`${API_URL}/files/sendfiles`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    respostas.push(data);
  }

  return respostas;
};


export const apagarArquivo = async (id: string) => {
  const response = await fetch(`${API_URL}/files/removefile`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_exclusao: id }),
  });

  return await response.json()
};
