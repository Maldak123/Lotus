from typing import IO, Optional
from fastapi import UploadFile
from pydantic import BaseModel


class DocumentoRetornoRequest(BaseModel):
    id_arquivo: str
    sessao: str
    filename: str
    content_type: str
    tamanho: int
    extensao: str


class RetornoRequest(BaseModel):
    status: int
    mensagem: Optional[str] = None
    documento: Optional[DocumentoRetornoRequest] = None


class ArquivoComMetadata:
    def __init__(self, id_arquivo: str, sessao: str, file: UploadFile, file_content: IO[bytes]):
        self.id_arquivo = id_arquivo
        self.sessao = sessao
        self.file = file
        self.file_content = file_content


class RemoveFileRequest(BaseModel):
    id_exclusao: str
