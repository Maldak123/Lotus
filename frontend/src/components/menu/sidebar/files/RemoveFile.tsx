import type { FileData } from "@/types/FileData";
import { X } from "lucide-react";

interface RemoveFileProps{
  removeFile: (file_id: string, session_id: string) => void
  file: FileData
}

const RemoveFile = ({removeFile, file}: RemoveFileProps) => {
  return (
    <button
      onClick={() => removeFile(file.document.file_id, file.document.session)}
      className="text-gray-500 transition-colors hover:text-white"
    >
      <X size={24} />
    </button>
  );
};

export default RemoveFile;
