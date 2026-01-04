from fastapi import UploadFile, File, Form, APIRouter, HTTPException
from dataclasses import dataclass
from pydantic import BaseModel
import re


router = APIRouter()

files = []


@dataclass
class ArquivoComMetadata:
    id: str
    sessao: str
    file: UploadFile


class RemoveFileRequest(BaseModel):
    id_exclusao: str


@router.post("/sendfiles")
async def receive_files(
    id: str = Form(...), sessao: str = Form(...), file: UploadFile = File(...)
):
    UUID = re.compile(
        r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.IGNORECASE
    )

    if not UUID.match(id):
        raise HTTPException(status_code=400, detail="ID inválido.")

    documento = ArquivoComMetadata(id=id, sessao=sessao, file=file)
    files.append(documento)
    extensao = f".{documento.file.filename.split(".")[-1]}"

    return {
        "status": 200,
        "documento": {
            "id_arquivo": documento.id,
            "sessao": documento.sessao,
            "filename": documento.file.filename,
            "content_type": documento.file.content_type,
            "tamanho": documento.file.size,
            "extensao": extensao,
        },
    }


@router.delete("/removefile")
async def remove_file(request: RemoveFileRequest):
    if not any(request.id_exclusao == e.id for e in files):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    files[:] = [e for e in files if e.id != request.id_exclusao]

    return {"status": 200}
