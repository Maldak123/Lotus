import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatProvider from "./contexts/ChatContext";
import FilesProvider from "./contexts/FilesContext";
import FilePreviewProvider from "./contexts/FilePreviewContext";
import ApplicationWrapper from "./components/AppWrapper/ApplicationWrapper";


const App = () => {
  useEffect(() => {
    const sessionHistorico = sessionStorage.getItem("sessionId") || "";

    if (!sessionHistorico) {
      sessionStorage.setItem("sessionId", `${uuidv4()}&&${Date.now()}`);
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
