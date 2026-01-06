from typing import Optional
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


class ArquivoComMetadata(BaseModel):
    id_arquivo: str
    sessao: str
    file: UploadFile


class RemoveFileRequest(BaseModel):
    id_exclusao: str
