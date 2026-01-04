export interface FileData {
  status: string;
  documento: {
    id_arquivo: string;
    sessao: string;
    filename: string;
    content_type: string;
    tamanho: number;
    extensao: string;
  };
}
