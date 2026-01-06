import React from "react";
import ChatProvider from "./contexts/ChatContext";
import FilesProvider from "./contexts/FilesContext";
import FilePreviewProvider from "./contexts/FilePreviewContext";
import ApplicationWrapper from "./components/AppWrapper/ApplicationWrapper";

const App = () => {
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
