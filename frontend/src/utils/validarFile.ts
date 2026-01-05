import { getArchiveType } from "./fileExtensions";

interface validarFileProps {
  e: React.ChangeEvent<HTMLInputElement>;
}

export const validarFile = ({ e }: validarFileProps) => {
  const TAMANHO_ARQUIVO = 5242880;
  const arquivosBloqueados: string[] = [];
  const extensoesBloqueadas: string[] = [];
  const alertas = [];
  let arquivosFiltrados: File[] = [];

  if (e.target.files && e.target.files.length > 0) {
    const arquivos = Array.from(e.target.files);

    arquivosFiltrados = arquivos.filter(
      (arq) =>
        arq.size <= TAMANHO_ARQUIVO && getArchiveType(arq.type) != undefined,
    );

    arquivos.forEach((e) => {
      const mimeType = getArchiveType(e.type);

      if (e.size > TAMANHO_ARQUIVO) {
        arquivosBloqueados.push(e.name);
      }

      if (!mimeType) {
        const extensao = e.name.split(".").slice(-1).join("");
        extensoesBloqueadas.push(extensao);
      }
    });

    if (arquivosBloqueados.length > 0) {
      alertas.push(`Os arquivos maiores que 5MB foram removidos.`);
    }
    if (extensoesBloqueadas.length > 0) {
      alertas.push(`Os arquivos do tipo .${extensoesBloqueadas.join(", .")} não são permitidos.`);
    }
  }

  return { arquivosFiltrados, arquivosBloqueados, alertas };
};
