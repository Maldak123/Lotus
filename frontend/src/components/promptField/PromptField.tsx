import FilesWrapper from "./files/FilesWrapper";
import InputField from "./inputField/InputField";
import { apagarArquivo } from "@/services/FileService";
import { useFilePreview } from "@/contexts/FilePreviewContext";

const PromptField = () => {
  const { filesPreview, setFilesPreview } = useFilePreview();

  // useEffect(() => {
  //   let qntArquivos = 0;

  //   const processarArquivos = async () => {
  //     const arquivos = await enviarArquivos(files);
  //     setFilesPreview(arquivos);
  //     setFiles([])
  //   };

  //   if (files.length > qntArquivos) {
  //     processarArquivos();
  //   } else {
  //     qntArquivos = files.length;
  //   }
  // }, [files, setFilesPreview, setFiles]);

  const removerArquivo = (id: string, index: number) => {
    apagarArquivo(id);

    setFilesPreview((files) =>
      files.filter((file) => file.documento.id_arquivo !== id),
    );
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      {filesPreview.length > 0 && (
        <div className="no-scrollbar overflow-scroll">
          <FilesWrapper remover={removerArquivo} />
        </div>
      )}

      <InputField />
    </div>
  );
};

export default PromptField;
