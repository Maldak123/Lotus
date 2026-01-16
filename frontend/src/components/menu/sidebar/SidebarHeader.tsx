import { useEffect, useState } from "react";
import { Folder } from "lucide-react";
import AddFileInput from "./add_file/AddFileInput";
import Alerta from "@/components/alerta/Alerta";
import type { AlertaType } from "@/types/AlertaType";

const SidebarHeader = () => {
  const [alertas, setAlertas] = useState<AlertaType[]>([]);

  useEffect(() => {
    if (alertas.length <= 0) {
      return;
    }

    setTimeout(() => {
      setAlertas([]);
    }, 5000);
  });

  return (
    <div className="flex w-full flex-col gap-4 p-3">
      <label
        htmlFor="file_input"
        className="group mt-14 flex w-full cursor-pointer justify-center gap-2 rounded-sm border border-[rgba(255,255,255,0.75)] bg-transparent py-2 text-[rgba(255,255,255,0.75)] transition-colors duration-200 hover:bg-white hover:text-[#111]"
      >
        <Folder
          className="text-white transition-colors duration-200 group-hover:text-[#111]"
          strokeWidth={1}
        />
        Adicionar arquivo
      </label>

      <AddFileInput setAlertas={setAlertas} />

      {alertas.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          {alertas.map((alerta, index) => (
            <Alerta alerta={alerta} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
