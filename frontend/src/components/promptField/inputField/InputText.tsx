import React, { useRef, useEffect } from "react";

interface InputTextProps {
  input: string;
  setInput: (msg: string) => void;
  enviar: () => void;
}

const InputText = ({ setInput, input, enviar }: InputTextProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const handleEnter = (e: React.KeyboardEvent) => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouch) {
      if (e.key === "Enter") {
        enviar();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <>
      <textarea
        ref={textareaRef}
        onChange={handleInput}
        onKeyDown={handleEnter}
        value={input}
        className="max-h-50 w-full resize-none rounded-lg bg-[#292929] p-2 text-[rgba(255,255,255,0.75)] outline-0 placeholder:text-sm placeholder:opacity-50 placeholder:lg:text-base"
        name="prompt"
        rows={2}
        id="input_prompt"
        placeholder="Pergunte algo sobre seus documentos..."
      />
    </>
  );
};

export default InputText;
