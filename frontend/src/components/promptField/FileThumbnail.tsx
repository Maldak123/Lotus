import React from "react";
import { X } from "lucide-react";
import { getArchiveType } from "@/utils/fileExtensions";
import { type FileData } from "@/types/FileData";
import Alerta from "./alerta/Alerta";
import type { AlertaType } from "@/types/AlertaType";

interface FileThumbnailProps {
  arquivo: FileData[];
  remover: (id: string, index: number) => void;
}

const FileThumbnailIcon = ({ extension }: { extension: string }) => {
  const [nome, info] = getArchiveType(extension) || [];

  if (nome && info) {
    return (
      <div
        className={`w-fit rounded p-2 text-xs font-bold ${info.bgColor} ${info.textColor}`}
      >
        {nome}
      </div>
    );
  }
};

const FileThumbnail = ({ arquivo, remover }: FileThumbnailProps) => {
  const arquivos = arquivo && Array.from(arquivo);
  const arquivoExistente: AlertaType[] = [
    {
      tipo: "erro",
      mensagem: "Arquivo já existe.",
    },
  ];

  return (
    <div className="flex w-full gap-2 overflow-y-scroll lg:grid lg:max-h-53 lg:grid-cols-3">
      {arquivo &&
        arquivos?.map((arquivo, index) => {
          if (arquivo.status === 200) {
            return (
              <div
                key={index}
                className="flex min-w-64 items-center justify-between rounded-lg border border-[#3c3c3c] bg-[#252525] p-3 lg:min-w-full"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <FileThumbnailIcon
                      extension={arquivo.documento.content_type}
                    />

                    <div className="flex flex-col gap-1">
                      <span className="w-32 truncate text-sm font-medium text-white">
                        {arquivo.documento.filename}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(arquivo.documento.tamanho / 1024 / 1024).toFixed(2)}MB
                        ({(arquivo.documento.tamanho / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => remover(arquivo.documento.file_id, index)}
                  className="text-gray-500 transition-colors hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            );
          } else {
            return <Alerta alertas={arquivoExistente} key={index} />;
          }
        })}
    </div>
  );
};

export default FileThumbnail;
