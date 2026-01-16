import { FileWarning } from "lucide-react";
import React from "react";

const Error = () => {
  return (
    <div className="group relative flex w-fit flex-col gap-2">
      <div className="absolute right-0 bottom-full mb-2 hidden w-50 rounded-sm border border-red-500/75 bg-red-500/50 p-1 text-sm group-hover:block">
        <p className="w-full">Ocorreu um erro ao processar o arquivo.</p>
      </div>
      <div className="rounded-sm border border-red-500/50 bg-red-500/20 p-0.75">
        <FileWarning className="text-red-500/75" />
      </div>
    </div>
  );
};

export default Error;
