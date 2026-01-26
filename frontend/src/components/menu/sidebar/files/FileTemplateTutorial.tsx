import { Check, X } from "lucide-react";
import FileIcon from "./FileIcon";
import type { FileData } from "@/types/FileData";

interface FileTemplateProps {
  file: FileData;
}

const FileTemplate = ({ file }: FileTemplateProps) => {
  return (
    <div className="flex min-w-64 items-center justify-between rounded-lg border border-[#3c3c3c] bg-[#252525] p-3 lg:min-w-100 h-25">
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

      <div className="flex h-full flex-col items-end justify-between">
        <X strokeWidth={1} />

        <div className="relative size-fit cursor-pointer">
          <input
            className="peer z-1 size-5 appearance-none rounded-sm border border-[rgba(255,255,255,0.5)] checked:bg-[rgba(255,255,255,0.25)]"
            type="checkbox"
            name="check_file"
          />
          <Check className="pointer-events-none absolute inset-0.5 hidden size-4 peer-checked:block" />
        </div>
      </div>
    </div>
  );
};

export default FileTemplate;
