import { useState } from "react";
import Logo from "@/components/logo/Logo";
import MenuWrapper from "@/components/menu/MenuWrapper";
import { useChat } from "@/contexts/ChatContext";

const Header = () => {
  const { chat } = useChat();
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
    <header className="absolute w-full">
      <div className="relative flex items-center justify-between overflow-x-clip p-4">
        <div
          onClick={animate}
          className={`opacity-0 transition-opacity duration-2000 ${chat.length > 0 && "opacity-100 pointer-events-auto cursor-pointer"}`}
        >
          <Logo size={3} animated={animated} />
        </div>

        <MenuWrapper />
      </div>
    </header>
  );
};

export default Header;
