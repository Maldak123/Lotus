import type { AlertaType } from "@/types/AlertaType";
import React from "react";

interface AlertaProps {
  alertas: AlertaType[];
}

const Alerta = ({ alertas }: AlertaProps) => {
  const classeErro = "bg-[#fb2c362c] text-red-500";
  const classeAlerta = "bg-[#D977062c] text-yellow-600";

  return alertas.map((alerta) => (
    <p
      className={`line-clamp-4 h-fit w-fit rounded-sm px-2 py-1 ${alerta.tipo === "erro" ? classeErro : classeAlerta}`}
    >
      {alerta.mensagem}
    </p>
  ));
};

export default Alerta;
