import React, { createContext, useContext, useState } from "react";

interface FilesContextProps {
  files: string[];
  setFiles: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [files, setFiles] = useState<string[]>([]);

  return (
    <FilesContext.Provider value={{ files, setFiles }}>
      {children}
    </FilesContext.Provider>
  );
}

export const useFiles = () => useContext(FilesContext);
