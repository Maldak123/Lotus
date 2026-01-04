import React from "react";
import Sidebar from "./layout/Sidebar";
import InputWrapper from "./components/promptField/PromptField";
import ChatWrapper from "./components/chat/ChatWrapper";

const App = () => {
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

export default App;
