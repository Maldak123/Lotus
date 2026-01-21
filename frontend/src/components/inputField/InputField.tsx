import { useState } from "react";
import InputText from "./InputText";
import SubmitButton from "./SubmitButton";
import { enviarChat } from "@/services/ChatService";
import { useChat } from "@/contexts/ChatContext";
import type { MessageResponse } from "@/types/Mensagem";
import { useFiles } from "@/contexts/FilesContext";

const InputField = () => {
  const { files } = useFiles();
  const { setChat, setIsThinking } = useChat();
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (input) {
      const mensagemUsuario: MessageResponse = {
        type: "human",
        content: input.trim(),
        filenames: files,
      };

      setInput("");
      setChat((prev) => [
        ...prev.filter((e) => e.type !== "error"),
        mensagemUsuario,
      ]);
      setIsThinking(true);

      const chatData = await enviarChat(mensagemUsuario);
      setChat((prev) => [...prev, chatData]);
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-end gap-2">
        <InputText setInput={setInput} input={input} enviar={handleSubmit} />
        <SubmitButton enviar={handleSubmit} />
      </div>
      <p className="text-center opacity-30 text-xs md:text-sm">
        Lotus é um projeto experimental e pode apresentar respostas imprecisas.
        Verifique as repostas.
      </p>
    </div>
  );
};

export default InputField;
