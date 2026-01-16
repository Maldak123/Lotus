from typing import IO, Optional
from fastapi import UploadFile
from pydantic import BaseModel


class DocumentResponse(BaseModel):
    file_id: str
    session: str
    filename: str
    content_type: str
    tamanho: int
    extensao: str


class Response(BaseModel):
    status: Optional[str] = None
    mensagem: Optional[str] = None
    document: Optional[DocumentResponse] = None


class MetadataFile:
    def __init__(
        self,
        file_id: str,
        session: str,
        file: UploadFile,
        file_content: Optional[IO[bytes]] = None,
    ):
        self.file_id = file_id
        self.session = session
        self.file = file
        self.file_content = file_content


class RemoveFileRequest(BaseModel):
    file_id: str
    session_id: str
