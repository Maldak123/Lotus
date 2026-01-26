import { Folder, Menu } from "lucide-react";
import PageHeader from "./page/PageHeader";
import PageText from "./page/PageText";

const TutorialTwo = () => {
  return (
    <div className="flex flex-col h-full gap-10 px-4">
      <PageHeader>Adicionando seus documentos</PageHeader>

      <div className="flex flex-wrap gap-8">
        <PageText>
          <p>Para adicionar seus documentos, clique no botão</p>
        </PageText>

        <div className="flex w-full items-center justify-center gap-2">
          <span className="text-sm lg:text-lg">Arquivos</span>
          <Menu size={32} strokeWidth={0.75} className="z-999 lg:size-12" />
        </div>

        <PageText>
          <p>
            no canto superior direito da página. Em seguida, selecione seus
            arquivos clicando no botão
          </p>
        </PageText>

        <div className="group flex w-full cursor-pointer justify-center gap-2 rounded-sm border border-[rgba(255,255,255,0.75)] bg-transparent py-2 text-[rgba(255,255,255,0.75)] transition-colors duration-200 hover:bg-white hover:text-[#111]">
          <Folder
            className="text-white transition-colors duration-200 group-hover:text-[#111]"
            strokeWidth={1}
          />
          Adicionar arquivo
        </div>

        <PageText>no menu lateral.</PageText>
      </div>
    </div>
  );
};

export default TutorialTwo;
