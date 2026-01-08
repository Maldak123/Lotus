import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatProvider from "./contexts/ChatContext";
import FilesProvider from "./contexts/FilesContext";
import FilePreviewProvider from "./contexts/FilePreviewContext";
import ApplicationWrapper from "./components/AppWrapper/ApplicationWrapper";

const App = () => {
  useEffect(() => {
    const sessaoHistorico = sessionStorage.getItem("sessaoId");

    if (!sessaoHistorico) {
      sessionStorage.setItem("sessaoId", `${uuidv4()}&&${Date.now()}`);
    }
  }, []);

  return (
    <ChatProvider>
      <FilesProvider>
        <FilePreviewProvider>
          <ApplicationWrapper />
        </FilePreviewProvider>
      </FilesProvider>
    </ChatProvider>
  );
};

export default App;
