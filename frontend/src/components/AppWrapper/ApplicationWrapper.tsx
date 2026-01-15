import React from "react";
import Header from "@/layout/Header";

const ApplicationWrapper = () => {
  return (
    <div className="h-dvh relative">
      <Header />
      <main className="flex w-full items-center justify-center">
        <div className="grid h-full w-full grid-rows-[1fr_auto] gap-6 p-4 lg:max-w-7/10 lg:py-8"></div>
      </main>
    </div>
  );
};

export default ApplicationWrapper;
