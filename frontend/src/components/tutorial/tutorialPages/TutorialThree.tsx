import { RingLoader } from "react-spinners";
import PageHeader from "./page/PageHeader";
import PageText from "./page/PageText";
import type { FileData } from "@/types/FileData";
import FileTemplateTutorial from "@/components/menu/sidebar/files/FileTemplateTutorial";

const TutorialThree = () => {
  const file: FileData = {
    status: "completed",
    document: {
      file_id: "qualquer-um",
      session: "qualquer-um",
      filename: "Arquivo.pdf",
      content_type: "application/pdf",
      tamanho: 123546,
      extensao: ".pdf",
    },
  };

  return (
    <div className="flex h-full flex-col items-center gap-6 px-4">
      <PageHeader>Seleção dos arquivos</PageHeader>

      <PageText>
        Após a seleção dos arquivos, será feito o carregamento deles,
        representado pelo seguinte indicador
      </PageText>

      <div>
        <RingLoader size={40} color="rgba(255,255,255)" />
      </div>

      <PageText>
        Após o carregamento, selecione os arquivos em que deseja realizar a
        busca marcando a checkbox repectiva
      </PageText>

      <FileTemplateTutorial file={file} />

      <PageText>
        Para fazer a exclusão de um arquivo, clique no X acima da checkbox.
      </PageText>
    </div>
  );
};

export default TutorialThree;
