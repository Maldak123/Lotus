import FileWrapper from "./FileWrapper.tsx";
import { useFilePreview } from "@/contexts/FilePreviewContext.tsx";

const FilesUploaded = () => {
  const { filesPreview } = useFilePreview();

  return (
    <div className="scrollbar-hidden flex h-full flex-col gap-2 overflow-y-scroll px-4 py-2">
      {filesPreview.length > 0 &&
        filesPreview.map((file) => (
          <FileWrapper key={file.document.file_id} file={file} />
        ))}
    </div>
  );
};

export default FilesUploaded;
