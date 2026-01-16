export interface Mensagem {
  sender: string;
  mensagem: string;
  filenames?: string[];
}

export interface MessageResponse {
  type: string;
  content: string;
  filenames?: string[];
}
