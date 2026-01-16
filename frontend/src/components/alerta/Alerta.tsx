import type { AlertaType } from "@/types/AlertaType";

interface AlertaProps {
  alerta: AlertaType;
}

const Alerta = ({ alerta }: AlertaProps) => {
  const classeErro = "bg-[#fb2c362c] text-red-500";
  const classeAlerta = "bg-[#D977062c] text-yellow-600";

  return (
    <div
      className={`w-fit rounded-sm px-2 py-1 ${alerta.tipo === "erro" ? classeErro : classeAlerta}`}
    >
      <p className="line-clamp-4">{alerta.mensagem}</p>
    </div>
  );
};

export default Alerta;
