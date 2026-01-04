import React, { useState } from "react";
import Logo from "@/components/logoAnimated/Logo";

const Sidebar = () => {
  const [animando, setAnimando] = useState(false);

  const ativarAnimacao = () => {
    if (animando) return;

    setAnimando(true);

    setTimeout(() => {
      setAnimando(false);
    }, 3000);
  };

  return (
    <div className="fixed w-full p-4">
      <div className="size-fit" onClick={ativarAnimacao}>
        <Logo animated={animando} />
      </div>
    </div>
  );
};

export default Sidebar;
