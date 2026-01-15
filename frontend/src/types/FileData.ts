export interface FileData {
  status?: "processing" | "completed" | "error";
  document: {
    file_id: string;
    session: string;
    filename: string;
    content_type: string;
    tamanho: number;
    extensao: string;
  };
}
