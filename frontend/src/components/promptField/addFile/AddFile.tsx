import React from "react";
import { Plus } from "lucide-react";

import { extensionsType } from "@/utils/fileExtensions";

interface AddFileProps {
  changeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddFile = ({ changeFile }: AddFileProps) => {
  const tiposAceitos = Object.values(extensionsType)
    .flatMap((info) => [...info.mimeTypes, ...info.extensions])
    .join(",");

  return (
    <>
      <label
        htmlFor="input_file"
        className="group flex cursor-pointer items-center justify-center rounded-full bg-[#333333] p-1 transition-colors hover:bg-[rgba(255,255,255,0.75)] lg:size-16"
      >
        <div className="flex items-center justify-center rounded-full bg-[#111] p-1 lg:size-14">
          <Plus className="text-[#333333] transition-colors group-hover:text-[rgba(255,255,255,0.75)] lg:scale-120 lg:stroke-2" />
        </div>
      </label>

      <input
        onChange={changeFile}
        className="hidden"
        type="file"
        id="input_file"
        accept={tiposAceitos}
        multiple
      />
    </>
  );
};

export default AddFile;
