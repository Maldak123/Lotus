import React from "react";

import File from "./File";
import { apagarArquivo } from "@/services/FileService";
import type { FileData } from "@/types/FileData";

interface FileWrapperProps {
  file: FileData;
}

const FileWrapper = ({ file }: FileWrapperProps) => {
  const removeFile = (file_id: string, session_id: string) => {
    apagarArquivo(file_id, session_id);
  };

  return (
    <div className="flex min-w-64 items-center justify-between rounded-lg border border-[#3c3c3c] bg-[#252525] p-3 lg:min-w-full">
      <File file={file} removeFile={removeFile} />
    </div>
  );
};

export default FileWrapper;
