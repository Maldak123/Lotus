import React from "react";
import { Plus } from "lucide-react";

interface AddFileProps {
  addArquivos: (arquivos: File[]) => void;
  setAlerta: (msg: string) => void;
}

const AddFile = ({ addArquivos, setAlerta }: AddFileProps) => {
  const aoMudarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const TAMANHO_ARQUIVO = 5242880;
    const arquivosBloqueados: string[] = [];
    let arquivosFiltrados: File[] = [];

    if (e.target.files && e.target.files.length > 0) {
      const arquivos = Array.from(e.target.files);

      arquivosFiltrados = arquivos.filter((arq) => arq.size <= TAMANHO_ARQUIVO);

      arquivos.forEach((e) => {
        if (e.size > TAMANHO_ARQUIVO) {
          arquivosBloqueados.push(e.name);
        }
      });

      if (arquivosBloqueados.length > 0) {
        setAlerta(
          `Os arquivos maiores que 5MB foram removidos. (${[arquivosBloqueados.join(", ")]})`,
        );
      }
    }

    addArquivos(arquivosFiltrados);
  };

  return (
    <div className="relative flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <label
          htmlFor="input_file"
          className="group flex cursor-pointer items-center justify-center rounded-full bg-[#333333] p-1 transition-colors hover:bg-[rgba(255,255,255,0.75)] lg:size-16"
        >
          <div className="flex items-center justify-center rounded-full bg-[#111] p-1 lg:size-13">
            <Plus className="text-[#333333] transition-colors group-hover:text-[rgba(255,255,255,0.75)] lg:scale-120 lg:stroke-3" />
          </div>
        </label>

        <input
          onChange={aoMudarArquivo}
          className="hidden"
          type="file"
          id="input_file"
          accept=".pdf, .doc"
          multiple
        />
      </div>
    </div>
  );
};

export default AddFile;
