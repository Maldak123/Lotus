import React, { useEffect, useState } from "react";
import AddFile from "./AddFile";
import InputText from "./InputText";
import SubmitButton from "./SubmitButton";
import { enviarChat } from "@/services/ChatService";
import type { FileData } from "@/types/FileData";

interface InputFieldProps {
  templateFiles: FileData[];
  setListaArquivos: React.Dispatch<React.SetStateAction<File[]>>;
}

const InputField = ({ setListaArquivos }: InputFieldProps) => {
  const [input, setInput] = useState("");
  const [alerta, setAlerta] = useState("");

  const filtrarArquivosRepetidos = (novosArquivos: File[]) => {
    setListaArquivos((atual) => {
      const nomes = atual.map((f) => f.name);
      const unicos = novosArquivos.filter((f) => !nomes.includes(f.name));
      return [...atual, ...unicos];
    });
  };

  useEffect(() => {
    if (alerta) {
      const timer = setTimeout(() => {
        setAlerta("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const handleSubmit = async () => {
    if (input) {
      enviarChat(input);
    }
  };

  return (
    <>
      {alerta && (
        <p className="line-clamp-4 h-fit w-fit rounded-sm bg-[#fb2c362c] px-2 py-1 text-red-500">
          {alerta}
        </p>
      )}

      <div className="flex w-full items-end gap-2">
        <AddFile addArquivos={filtrarArquivosRepetidos} setAlerta={setAlerta} />
        <InputText setInput={setInput} />
        <SubmitButton enviar={handleSubmit} />
      </div>
    </>
  );
};

export default InputField;
