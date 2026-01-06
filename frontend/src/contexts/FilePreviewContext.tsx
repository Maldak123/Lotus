import type { FileData } from "@/types/FileData";
import React, { createContext, useContext, useState } from "react";

interface FilePreviewContextProps {
  filesPreview: FileData[];
  setFilesPreview: React.Dispatch<React.SetStateAction<FileData[]>>;
}

export const FilePreviewContext = createContext<FilePreviewContextProps>({
  filesPreview: [],
  setFilesPreview: () => {},
});

export default function FilePreviewProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [filesPreview, setFilesPreview] = useState<FileData[]>([]);

  return (
    <FilePreviewContext.Provider value={{ filesPreview, setFilesPreview }}>
      {children}
    </FilePreviewContext.Provider>
  );
}

export const useFilePreview = () => useContext(FilePreviewContext);
