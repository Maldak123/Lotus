import React, { useEffect, useState } from "react";
import InputText from "./InputText";
import SubmitButton from "./SubmitButton";
import { enviarChat } from "@/services/ChatService";
import type { FileData } from "@/types/FileData";
import AddFileWrapper from "./addFile/AddFileWrapper";
import { useChat } from "@/contexts/ChatContext";
import { type Mensagem } from "@/types/Mensagem";

interface InputFieldProps {
  templateFiles: FileData[];
  setListaArquivos: React.Dispatch<React.SetStateAction<File[]>>;
}

const InputField = ({ setListaArquivos }: InputFieldProps) => {
  const { setChat } = useChat();

  const [input, setInput] = useState("");
  const [alerta, setAlerta] = useState<string[]>([]);

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
        setAlerta([]);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const handleSubmit = async () => {
    if (input) {
      const mensagemUsuario: Mensagem = {
        sender: "user",
        mensagem: input.trim(),
      };

      setChat((prev) => [...prev, mensagemUsuario]);

      const chatData = await enviarChat(mensagemUsuario);
      setChat((prev) => [...prev, chatData]);

      setInput("")
    }
  };

  return (
    <>
      {alerta && (
        <div className="flex flex-col gap-2">
          {alerta.map((e) => (
            <p className="line-clamp-4 h-fit w-fit rounded-sm bg-[#fb2c362c] px-2 py-1 text-red-500">
              {e}
            </p>
          ))}
        </div>
      )}

      <div className="flex w-full items-end gap-2">
        <AddFileWrapper
          addArquivos={filtrarArquivosRepetidos}
          setAlerta={setAlerta}
        />
        <InputText setInput={setInput} input={input} enviar ={handleSubmit} />
        <SubmitButton enviar={handleSubmit} />
      </div>
    </>
  );
};

export default InputField;
