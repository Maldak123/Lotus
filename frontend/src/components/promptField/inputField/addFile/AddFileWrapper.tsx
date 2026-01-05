import React from "react";
import AddFile from "./AddFile";
import { validarFile } from "@/utils/validarFile";

interface AddFileWrapperProps {
  addArquivos: (arquivos: File[]) => void;
  setAlerta: (alertas: string[]) => void;
}

const AddFileWrapper = ({ addArquivos, setAlerta }: AddFileWrapperProps) => {
  const aoMudarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = validarFile({ e: evento });

    if (arquivo.alertas) {
      setAlerta(arquivo.alertas);
    }

    addArquivos(arquivo.arquivosFiltrados);
  };

  return (
    <div className="relative flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <AddFile changeFile={aoMudarArquivo} />
      </div>
    </div>
  );
};

export default AddFileWrapper;
