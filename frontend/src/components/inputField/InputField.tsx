import { useState } from "react";
import InputText from "./InputText";
import SubmitButton from "./SubmitButton";
import { enviarChat } from "@/services/ChatService";
import { useChat } from "@/contexts/ChatContext";
import type { MessageResponse } from "@/types/Mensagem";
import { useFiles } from "@/contexts/FilesContext";


const InputField = () => {
  const { files } = useFiles()
  const { setChat } = useChat();
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (input) {
      const mensagemUsuario: MessageResponse = {
        type: "human",
        content: input.trim(),
        filenames: files
      };

      setInput("");
      setChat((prev) => [...prev, mensagemUsuario]);

      const chatData = await enviarChat(mensagemUsuario);
      setChat((prev) => [...prev, chatData]);
    }
  };

  return (
    <>
      <div className="flex w-full items-end gap-2">
        <InputText setInput={setInput} input={input} enviar={handleSubmit} />
        <SubmitButton enviar={handleSubmit} />
      </div>
    </>
  );
};

export default InputField;
