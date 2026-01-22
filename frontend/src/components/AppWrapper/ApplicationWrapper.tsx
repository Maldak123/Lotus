import { useEffect, useState } from "react";
import Header from "@/layout/Header";
import ChatWrapper from "../chat/ChatWrapper";
import InputField from "../inputField/InputField";
import { getSessionMessages } from "@/services/ChatService";
import { useChat } from "@/contexts/ChatContext";
import { getSessionFiles } from "@/services/FileService";
import { useFilePreview } from "@/contexts/FilePreviewContext";
import TutorialWrapper from "../tutorial/TutorialWrapper";

const ApplicationWrapper = () => {
  const { setChat } = useChat();
  const { setFilesPreview } = useFilePreview();

  // Santa bagunça kkkkkkkkkk
  const tutorial = localStorage.getItem("tutorialDone");
  const [tutorialDone, setTutorialDone] = useState(tutorial);
  const isTutorialDone = tutorialDone !== "done";

  useEffect(() => {
    const sessionHistorico = sessionStorage.getItem("sessionId");

    if (!sessionHistorico) {
      return;
    }

    const fetchFiles = async (sessionHistorico: string) => {
      const files_history = await getSessionFiles(sessionHistorico);
      setFilesPreview(files_history);
    };

    const fetchMessages = async (sessionHistorico: string) => {
      const chat_history = await getSessionMessages(sessionHistorico);
      setChat(chat_history);
    };

    fetchFiles(sessionHistorico);
    fetchMessages(sessionHistorico);
  }, [setChat, setFilesPreview]);

  return (
    <div className="relative h-dvh">
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isTutorialDone ? "100%" : "0%",
          height: isTutorialDone ? "100%" : "0%",
        }}
      >
        <TutorialWrapper setTutorialDone={setTutorialDone} />
      </div>

      <div
        className="h-full"
        style={{ display: isTutorialDone ? "none" : "block" }}
      >
        <Header />
        <main className="flex h-full w-full items-center justify-center">
          <div className="grid h-full w-full grid-rows-[1fr_auto] gap-6 p-4 lg:max-w-7/10 lg:py-8">
            <ChatWrapper />
            <InputField />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationWrapper;
