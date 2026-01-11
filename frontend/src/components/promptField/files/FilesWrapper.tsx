import React from "react";
import Alerta from "../alerta/Alerta";
import type { AlertaType } from "@/types/AlertaType";
import Files from "./Files";
import { useFilePreview } from "@/contexts/FilePreviewContext";

interface FilesWrapperProps {
  remover: (file_id: string, session_id: string) => void;
}

const FilesWrapper = ({ remover }: FilesWrapperProps) => {
  const { filesPreview } = useFilePreview();

  // const arquivos = file && Array.from(file);
  const arquivosExistentes: string[] = [];
  const alertaArquivoExistente: AlertaType[] = [
    {
      tipo: "erro",
      mensagem: `Os arquivos ${arquivosExistentes.join(", ")} já existem.`,
    },
  ];

  return (
    <div className="flex w-full gap-2 overflow-y-scroll lg:grid lg:max-h-53 lg:grid-cols-3">
      {filesPreview &&
        filesPreview?.map((file, index) => {
          if (file.status === 200) {
            return <Files key={index} file={file} removerArquivo={remover} />;
          } else {
            console.log(file);

            arquivosExistentes.push(file.documento.filename);
          }

          if (arquivosExistentes.length > 0)
            <Alerta alertas={alertaArquivoExistente} />;
        })}
    </div>
  );
};

export default FilesWrapper;
