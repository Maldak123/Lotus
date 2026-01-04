import { useEffect, useState } from "react";
import Files from "./Files";
import InputField from "./inputField/InputField";
import type { FileData } from "@/types/FileData";
import { apagarArquivo, enviarArquivos } from "@/services/FileService";

const PromptField = () => {
  const [listaArquivos, setListaArquivos] = useState<File[]>([]);
  const [templateFiles, setTemplateFiles] = useState<FileData[]>([]);

  useEffect(() => {
    let qntArquivos = 0;

    const processarArquivos = async () => {
      try {
        const arquivos = await enviarArquivos(listaArquivos);
        setTemplateFiles(arquivos);
      } catch (e) {
        console.log("erro: " + e);
      }
    };

    if (listaArquivos.length > qntArquivos) {
      processarArquivos();
    } else {
      qntArquivos = listaArquivos.length;
    }
  }, [listaArquivos]);

  const removerArquivo = (id: string, index: number) => {
    console.log(index);

    apagarArquivo(id)
    setListaArquivos((arq) => arq.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      {listaArquivos.length > 0 && (
        <div className="no-scrollbar overflow-scroll">
          <Files arquivo={templateFiles} remover={removerArquivo} />
        </div>
      )}

      <InputField
        setListaArquivos={setListaArquivos}
        templateFiles={templateFiles}
      />
    </div>
  );
};

export default PromptField;
