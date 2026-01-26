import PageHeader from "./page/PageHeader";
import PageText from "./page/PageText";

const TutorialOne = () => {
  return (
    <div className="flex flex-col h-full gap-10 px-4">
      <PageHeader>
        Olá! <br /> Bem-vindo a Lotus.
      </PageHeader>

      <PageText>
        <p>
          Lotus é um sistema RAG (Retrieval Augmented Generation) com o
          propósito de te ajudar a buscar informações em seus documentos!
        </p>
        <p>
          Este guia rápido irá te apresentar o funcionamento da Lotus e como
          utilizá-la.
        </p>
      </PageText>
    </div>
  );
};

export default TutorialOne;
