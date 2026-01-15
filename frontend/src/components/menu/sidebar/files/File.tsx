import React, { useEffect } from "react";
import { X } from "lucide-react";
import FileIcon from "./FileIcon";
import type { FileData } from "@/types/FileData";
import { getStatusFile } from "@/services/FileService";
import { useFilePreview } from "@/contexts/FilePreviewContext";

interface FileProps {
  file: FileData;
  removeFile: (file_id: string, session_id: string) => void;
}

const File = ({ file, removeFile }: FileProps) => {
  // const [status,] = useState(file.status || "processing")
  const { updateStatusFile } = useFilePreview()
  console.log(file.status)

  useEffect(() => {
    let interval: number | undefined
    if (file.status !== "completed") {
      interval = setInterval(async () => {
        const currentStatus = await getStatusFile(file.document.file_id);
        updateStatusFile(currentStatus)
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [file.document.file_id, file.status, updateStatusFile]);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <FileIcon extension={file.document.content_type} />

          <div className="flex flex-col gap-1">
            <span className="w-32 truncate text-sm font-medium text-white">
              {file.document.filename}
            </span>
            <span className="text-xs text-gray-500">
              {(file.document.tamanho / 1024 / 1024).toFixed(2)}MB (
              {(file.document.tamanho / 1024).toFixed(1)} KB)
            </span>
          </div>
        </div>
      </div>

      {file.status === "error" && (
        <p>erro</p>
      )}

      {file.status === "processing" && (
        <p>carregando</p>
      )}

      {file.status === "completed" && (
        <button
          onClick={() => removeFile(file.document.file_id, file.document.session)}
          className="text-gray-500 transition-colors hover:text-white"
        >
          <X size={18} />
        </button>
      )}
    </>
  );
};

export default File;
