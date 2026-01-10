export interface FileData {
  status: number;
  documento: {
    file_id: string;
    session: string;
    filename: string;
    content_type: string;
    tamanho: number;
    extensao: string;
  };
}
