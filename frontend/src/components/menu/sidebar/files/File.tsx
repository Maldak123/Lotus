import React from "react";
import type { FileData } from "@/types/FileData";
import { RingLoader } from "react-spinners";
import { useFiles } from "@/contexts/FilesContext";
import FileIcon from "./FileIcon";
import Error from "./fileStatus/Error";
import Checkbox from "./fileStatus/Checkbox";
import RemoveFile from "./RemoveFile";

interface FileProps {
  file: FileData;
  removeFile: (file_id: string, session_id: string) => void;
}

const File = ({ file, removeFile }: FileProps) => {
  const { setFiles } = useFiles();

  const addFile: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.checked) {
      setFiles((prev) => [...prev, file.document.filename]);
    }
  };

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
        <div className="flex h-full flex-col items-end justify-between">
          <RemoveFile removeFile={removeFile} file={file} />

          <Error />
        </div>
      )}

      {file.status === "processing" && (
        <RingLoader color="rgba(255,255,255,0.75)" size={32} />
      )}

      {file.status === "completed" && (
        <div className="flex h-full flex-col items-end justify-between">
          <RemoveFile removeFile={removeFile} file={file} />

          <Checkbox addFile={addFile} />
        </div>
      )}
    </>
  );
};

export default File;
