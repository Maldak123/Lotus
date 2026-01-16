import React, { useEffect } from "react";

import File from "./File";
import { apagarArquivo, getStatusFile } from "@/services/FileService";
import type { FileData } from "@/types/FileData";
import { useFilePreview } from "@/contexts/FilePreviewContext";

interface FileWrapperProps {
  file: FileData;
}

const FileWrapper = ({ file }: FileWrapperProps) => {
  const { setFilesPreview } = useFilePreview();
  const { updateStatusFile } = useFilePreview();


  useEffect(() => {
    let interval: number | undefined;
    if (file.status === "processing") {
      interval = setInterval(async () => {
        const currentStatus = await getStatusFile(file.document.file_id);
        updateStatusFile(currentStatus);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [file.document.file_id, file.status, updateStatusFile]);

  const removeFile = (file_id: string, session_id: string) => {
    apagarArquivo(file_id, session_id);
    setFilesPreview((prev) =>
      prev.filter((arq) => arq.document.file_id !== file_id),
    );
  };

  return (
    <div className="flex min-w-64 items-center justify-between rounded-lg border border-[#3c3c3c] bg-[#252525] p-3 lg:min-w-full">
      <File file={file} removeFile={removeFile} />
    </div>
  );
};

export default FileWrapper;
