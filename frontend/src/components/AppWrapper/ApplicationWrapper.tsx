import React from "react";
import ChatWrapper from "../chat/ChatWrapper";
import InputWrapper from "../promptField/PromptField";
import Sidebar from "@/layout/Sidebar";

const ApplicationWrapper = () => {
  return (
    <>
      <Sidebar />
      <main className="flex h-dvh w-full items-center justify-center">
        <div className="grid h-full w-full grid-rows-[1fr_auto] gap-6 p-4 lg:max-w-7/10 lg:py-8">
          <ChatWrapper />
          <InputWrapper />
        </div>
      </main>
    </>
  );
};

export default ApplicationWrapper;
