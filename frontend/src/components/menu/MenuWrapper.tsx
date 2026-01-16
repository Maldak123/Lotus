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
            className="z-999"
          />
          <span
            onClick={() => setSidebar(!sidebar)}
            className="fixed inset-0 z-997 w-full bg-black opacity-75"
          ></span>
        </>
      ) : (
        <Menu
          size={32}
          onClick={() => setSidebar(!sidebar)}
          className="z-999"
        />
      )}

      <SidebarWrapper sidebar={sidebar} />
    </>
  );
};

export default MenuWrapper;
