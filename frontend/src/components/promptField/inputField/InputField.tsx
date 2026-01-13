import React, { useEffect, useState } from "react";
import InputText from "./InputText";
import SubmitButton from "./SubmitButton";
import AddFileWrapper from "../addFile/AddFileWrapper";
import Alerta from "@/components/promptField/alerta/Alerta";
import { enviarChat } from "@/services/ChatService";
import { useChat } from "@/contexts/ChatContext";
import { useFiles } from "@/contexts/FilesContext";
import { useFilePreview } from "@/contexts/FilePreviewContext";
import type { Mensagem } from "@/types/Mensagem";
import type { AlertaType } from "@/types/AlertaType";


const InputField = () => {
  const { setChat } = useChat();
  const { setFiles } = useFiles();
  const { setFilesPreview } = useFilePreview()

  const [input, setInput] = useState("");
  const [alertas, setAlertas] = useState<AlertaType[]>([]);

  useEffect(() => {
    if (alertas) {
      const timer = setTimeout(() => {
        setAlertas([]);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alertas]);

  const handleSubmit = async () => {
    if (input) {
      const mensagemUsuario: Mensagem = {
        sender: "user",
        mensagem: input.trim(),
      };

      setChat((prev) => [...prev, mensagemUsuario]);
      
      setInput("");
      setFilesPreview([]);
      setFiles([]);

      const chatData = await enviarChat(mensagemUsuario);
      setChat((prev) => [...prev, chatData]);

    }
  };

  return (
    <>
      {alertas && (
        <div className="flex flex-col gap-2">
          <Alerta alertas={alertas} />
        </div>
      )}

      <div className="flex w-full items-end gap-2">
        <AddFileWrapper
          setAlerta={setAlertas}
        />
        <InputText setInput={setInput} input={input} enviar={handleSubmit} />
        <SubmitButton enviar={handleSubmit} />
      </div>
    </>
  );
};

export default InputField;
