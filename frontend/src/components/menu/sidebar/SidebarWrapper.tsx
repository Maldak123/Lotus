import React from "react";
import Sidebar from "./Sidebar";

interface SidebarWrapperProps {
  sidebar: boolean;
}

const SidebarWrapper = ({ sidebar }: SidebarWrapperProps) => {
  return (
    <div
      style={sidebar ? { right: "0%" } : { right: "-100%" }}
      className="absolute top-0 z-998 h-dvh w-full max-w-8/10 bg-[#1e1e1e] transition-all duration-500 md:max-w-4/10 lg:max-w-3/10"
    >
      {sidebar && <Sidebar />}
    </div>
  );
};

export default SidebarWrapper;
