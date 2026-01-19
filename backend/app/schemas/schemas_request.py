from pathlib import Path
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, computed_field
from fastapi import File, Form, HTTPException, UploadFile, status

from ..utils.validations import validations


class FileRequest:
    def __init__(
        self,
        file_id: UUID = Form(...),
        session: str = Form(...),
        file: UploadFile = File(...),
    ):
        self.file_id = file_id
        self.session = session
        self.file = file
        self._validate()

    def _validate(self):
        error_msg = None

        if validations.validate_file_size(self.file.size):
            error_msg = "Os documentos devem ter no máximo 5MB."
        elif not validations.validate_mimetype(self.file.content_type):
            error_msg = "Arquivo inválido."
        elif not validations.validate_session(self.session):
            error_msg = "ID de sessão inválido."

        if error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "mensagem": error_msg,
                    "documento": DocumentResponse(
                        file_id=str(self.file_id),
                        session=self.session,
                        filename=self.file.filename,
                        content_type=self.file.content_type,
                        tamanho=self.file.size,
                    ),
                },
            )


class DocumentResponse(BaseModel):
    file_id: str
    session: str
    filename: str
    content_type: str
    tamanho: int

    @computed_field
    @property
    def extensao(self) -> str:
        return Path(self.filename).suffix


class Response(BaseModel):
    status: Optional[str] = None
    mensagem: Optional[str] = None
    document: Optional[DocumentResponse] = None


class RemoveFileRequest(BaseModel):
    file_id: str
    session_id: str
