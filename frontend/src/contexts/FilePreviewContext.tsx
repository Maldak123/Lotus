import type { FileData } from "@/types/FileData";
import React, { createContext, useContext, useState } from "react";

interface FilePreviewContextProps {
  filesPreview: FileData[];
  setFilesPreview: React.Dispatch<React.SetStateAction<FileData[]>>;
  updateStatusFile: (updatedFile: {
    file_id: string;
    status: "processing" | "completed" | "error";
  }) => void;
}

export const FilePreviewContext = createContext<FilePreviewContextProps>({
  filesPreview: [],
  setFilesPreview: () => {},
  updateStatusFile: () => {},
});

export default function FilePreviewProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [filesPreview, setFilesPreview] = useState<FileData[]>([]);

  const updateStatusFile = (updatedFile: {
    file_id: string;
    status: "processing" | "completed" | "error";
  }) => {
    setFilesPreview((prev) =>
      prev.map((file) =>
        file.document.file_id === updatedFile.file_id
          ? { ...file, status: updatedFile.status }
          : file,
      ),
    );
  };

  return (
    <FilePreviewContext.Provider
      value={{ filesPreview, setFilesPreview, updateStatusFile }}
    >
      {children}
    </FilePreviewContext.Provider>
  );
}

export const useFilePreview = () => useContext(FilePreviewContext);
