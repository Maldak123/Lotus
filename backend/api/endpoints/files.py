from pathlib import Path
from uuid import UUID
from typing import Dict

from fastapi import UploadFile, File, Form, APIRouter, HTTPException, status
from .schemas import (
    RemoveFileRequest,
    RetornoRequest,
    DocumentoRetornoRequest,
    ArquivoComMetadata,
)

router = APIRouter()

files_db: Dict[str, ArquivoComMetadata] = {}


def criar_documento_retorno(doc: ArquivoComMetadata) -> DocumentoRetornoRequest:
    extensao = Path(doc.file.filename).suffix

    return DocumentoRetornoRequest(
        id_arquivo=doc.id_arquivo,
        sessao=doc.sessao,
        filename=doc.file.filename,
        content_type=doc.file.content_type,
        tamanho=doc.file.size,
        extensao=extensao,
    )


@router.post("/sendfiles")
async def receive_files(
    id_arquivo: UUID = Form(...),
    sessao: str = Form(...),
    file: UploadFile = File(...),
):
    str_id = str(id_arquivo)

    novo_documento = ArquivoComMetadata(id_arquivo=str_id, sessao=sessao, file=file)
    files_db[str_id] = novo_documento

    return RetornoRequest(
        status=200,
        documento=criar_documento_retorno(novo_documento),
    ).model_dump()


@router.delete("/removefile")
async def remove_file(request: RemoveFileRequest):
    arquivo_removido = files_db.pop(request.id_exclusao, None)

    if not arquivo_removido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Arquivo não encontrado"
        )

    print(f"Removido: {arquivo_removido.id_arquivo}")

    return RetornoRequest(
        status=200,
        mensagem="Arquivo removido.",
        documento=criar_documento_retorno(arquivo_removido),
    ).model_dump()
