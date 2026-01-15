import React, { createContext, useContext, useState } from "react";

interface FilesContextProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export const FilesContext = createContext<FilesContextProps>({
  files: [],
  setFiles: () => {},
});

export default function FilesProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FilesContext.Provider value={{ files, setFiles }}>
      {children}
    </FilesContext.Provider>
  );
}

export const useFiles = () => useContext(FilesContext);
