import React from "react";
import type { FileData } from "@/types/FileData";
import { getArchiveType } from "@/utils/fileExtensions";
import { X } from "lucide-react";

interface FilesProps {
  arquivo: FileData;
  removerArquivo: (file_id: string, session_id: string) => void;
}

const FileIcon = ({ extension }: { extension: string }) => {
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

const Files = ({ arquivo, removerArquivo }: FilesProps) => {
  return (
    <div className="flex min-w-64 items-center justify-between rounded-lg border border-[#3c3c3c] bg-[#252525] p-3 lg:min-w-full">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <FileIcon extension={arquivo.documento.content_type} />

          <div className="flex flex-col gap-1">
            <span className="w-32 truncate text-sm font-medium text-white">
              {arquivo.documento.filename}
            </span>
            <span className="text-xs text-gray-500">
              {(arquivo.documento.tamanho / 1024 / 1024).toFixed(2)}MB (
              {(arquivo.documento.tamanho / 1024).toFixed(1)} KB)
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => removerArquivo(arquivo.documento.file_id, arquivo.documento.session)}
        className="text-gray-500 transition-colors hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Files;
