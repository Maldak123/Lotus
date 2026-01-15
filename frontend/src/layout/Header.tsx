import React, { useState } from "react";
import Logo from "@/components/logo/Logo";
import MenuWrapper from "@/components/menu/MenuWrapper";

const Header = () => {
  const [animated, setAnimated] = useState(false);

  const animate = () => {
    if (animated) {
      return;
    }
    setAnimated(true);

    setTimeout(() => {
      setAnimated(false);
    }, 5000);
  };

  return (
    <>
      <header className="relative flex items-center justify-between overflow-x-clip p-4">
        <div onClick={animate}>
          <Logo size={3} animated={animated} />
        </div>

        <MenuWrapper />
      </header>
    </>
  );
};

export default Header;
