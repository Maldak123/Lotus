import React, { createContext, useContext, useState } from "react";

interface FilesContextProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  filterSetFiles: (novos: File[]) => void
}

export const FilesContext = createContext<FilesContextProps>({
  files: [],
  setFiles: () => {},
  filterSetFiles: () => {}
});

export default function FilesProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const filterSetFiles = (novos: File[]) => {
    setFiles((atual) => {
      const nomes = atual.map((f) => f.name);
      const unicos = novos.filter((f) => !nomes.includes(f.name));

      return [...atual, ...unicos];
    });
  };

  return (
    <FilesContext.Provider value={{ files, setFiles, filterSetFiles }}>
      {children}
    </FilesContext.Provider>
  );
}

export const useFiles = () => useContext(FilesContext);
