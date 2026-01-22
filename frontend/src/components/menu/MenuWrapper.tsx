import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarWrapper from "./sidebar/SidebarWrapper";

const MenuWrapper = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      {sidebar ? (
        <>
          <X
            onClick={() => setSidebar(!sidebar)}
            color="rgba(255,255,255,0.75)"
            size={32}
            strokeWidth={0.75}
            className="z-999"
          />
          <span
            onClick={() => setSidebar(!sidebar)}
            className="fixed inset-0 z-997 w-full bg-black opacity-75"
          ></span>
        </>
      ) : (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setSidebar(!sidebar)}
        >
          <span className="text-sm">Arquivos</span>
          <Menu size={32} strokeWidth={0.75} className="z-999" />
        </div>
      )}

      <SidebarWrapper sidebar={sidebar} />
    </>
  );
};

export default MenuWrapper;
