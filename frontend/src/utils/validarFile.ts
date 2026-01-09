import type { AlertaType } from "@/types/AlertaType";
import { getArchiveType } from "./fileExtensions";

interface validarFileProps {
  e: React.ChangeEvent<HTMLInputElement>;
}

export const validarFile = ({ e }: validarFileProps) => {
  const TAMANHO_ARQUIVO = 5242880;
  const arquivosBloqueados: string[] = [];
  const extensoesBloqueadas: Set<string> = new Set;
  const alertas: AlertaType[] = [];
  let arquivosFiltrados: File[] = [];

  if (e.target.files && e.target.files.length > 0) {
    const arquivos = Array.from(e.target.files);

    arquivosFiltrados = arquivos.filter(
      (arq) =>
        arq.size <= TAMANHO_ARQUIVO && getArchiveType(arq.type) != undefined,
    );

    arquivos.forEach((e) => {
      const mimeType = getArchiveType(e.type);
      const extensao = `.${e.name.split(".")[-1]}`

      if (e.size > TAMANHO_ARQUIVO) {
        arquivosBloqueados.push(e.name);
      }

      if (!mimeType) {
        const extensao = e.name.split(".").slice(-1).join("");
        extensoesBloqueadas.add(extensao);
      }
    });

    if (arquivosBloqueados.length > 0) {
      alertas.push({
        tipo: "alerta",
        mensagem: `Os arquivos maiores que 5MB foram removidos.`,
      });
    }
    if (extensoesBloqueadas.size > 0) {
      alertas.push({
        tipo: "alerta",
        mensagem: `Os arquivos do tipo .${Array.from(extensoesBloqueadas).join(", .")} não são permitidos.`,
      });
    }
  }

  return { arquivosFiltrados, arquivosBloqueados, alertas };
};
