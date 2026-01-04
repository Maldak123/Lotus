import React, { useRef } from "react";

interface InputTextProps {
  setInput: (msg: string) => void;
}

const InputText = ({ setInput }: InputTextProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    setInput(e.target.value.trim());
  };

  return (
    <>
      <textarea
        ref={textareaRef}
        onChange={handleInput}
        className="max-h-50 w-full resize-none rounded-lg bg-[#292929] p-2 text-[rgba(255,255,255,0.75)] outline-0 placeholder:text-sm placeholder:opacity-50"
        name="prompt"
        rows={2}
        id="input_prompt"
        placeholder="Pergunte algo sobre seus documentos..."
      />
    </>
  );
};

export default InputText;
