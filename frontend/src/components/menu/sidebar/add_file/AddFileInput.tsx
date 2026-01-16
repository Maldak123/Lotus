import React from "react";
import { validarFile } from "@/utils/validarFile";
import { enviarArquivos } from "@/services/FileService";
import type { AlertaType } from "@/types/AlertaType";
import { useFilePreview } from "@/contexts/FilePreviewContext";

interface AddFileInputProps {
  setAlertas: React.Dispatch<React.SetStateAction<AlertaType[]>>;
}

const AddFileInput = ({ setAlertas }: AddFileInputProps) => {
  const { setFilesPreview } = useFilePreview();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    if (!e.target.files) {
      return;
    }

    const arquivos = e.target.files;
    const arquivos_filtrados = validarFile(arquivos);

    for (const arquivo of arquivos_filtrados.arquivosFiltrados) {
      const res = await enviarArquivos(arquivo);
      setFilesPreview((prev) => [...prev, res]);
    }
    setAlertas(arquivos_filtrados.alertas);
  };

  return (
    <input
      type="file"
      name="file"
      id="file_input"
      className="hidden"
      multiple
      onChange={onFileChange}
    />
  );
};

export default AddFileInput;
