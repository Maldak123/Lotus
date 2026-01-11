import React, { useCallback, useEffect, useRef } from "react";
import AddFile from "./AddFile";
import { validarFile } from "@/utils/validarFile";
import type { AlertaType } from "@/types/AlertaType";
import { useFiles } from "@/contexts/FilesContext";
import { enviarArquivos } from "@/services/FileService";
import { useFilePreview } from "@/contexts/FilePreviewContext";

interface AddFileWrapperProps {
  setAlerta: (alertas: AlertaType[]) => void;
}

const AddFileWrapper = ({ setAlerta }: AddFileWrapperProps) => {
  const { filterSetFiles, files, setFiles } = useFiles();
  const { setFilesPreview } = useFilePreview();
  const qntArquivos = useRef<number>(0);

  const processarArquivos = useCallback(
    async (index: number) => {
      const arquivos = await enviarArquivos(files.slice(index));
      setFilesPreview((prev) => [...prev, ...arquivos]);
      setFiles([]);
    },
    [files, setFilesPreview, setFiles],
  );

  useEffect(() => {
    if (files.length > qntArquivos.current) {
      processarArquivos(qntArquivos.current);
      qntArquivos.current = files.length;
    } else {
      qntArquivos.current = files.length;
    }
  }, [files, processarArquivos]);

  const onChangeFile = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const file = validarFile({ e: evento });

    if (file.alertas) {
      setAlerta(file.alertas);
    }

    filterSetFiles(file.arquivosFiltrados);
    evento.target.value = "";
  };

  return (
    <div className="relative flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <AddFile changeFile={onChangeFile} />
      </div>
    </div>
  );
};

export default AddFileWrapper;
