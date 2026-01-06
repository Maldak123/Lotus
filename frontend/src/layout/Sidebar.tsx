import React, { useState } from "react";
import Logo from "@/components/logoAnimated/Logo";
import { useChat } from "@/contexts/ChatContext";

const Sidebar = () => {
  const { chat } = useChat();
  const [animando, setAnimando] = useState(false);

  const visivel = chat.length > 0;

  const ativarAnimacao = () => {
    if (animando) return;

    setAnimando(true);

    setTimeout(() => {
      setAnimando(false);
    }, 5000);
  };

  return (
    <div
      className={`fixed w-full p-4 transition-opacity duration-2000 ${visivel ? "opacity-100" : "opacity-0"}`}
    >
      <div className={`size-fit ${!visivel && 'hidden'}`} onClick={ativarAnimacao}>
        <Logo animated={animando} />
      </div>
    </div>
  );
};

export default Sidebar;
