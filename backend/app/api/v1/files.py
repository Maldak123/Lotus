import io
from pathlib import Path
import time
from uuid import UUID
from typing import Dict

from fastapi import (
    BackgroundTasks,
    UploadFile,
    File,
    Form,
    APIRouter,
    HTTPException,
    status,
)

from ...services.redis_cache import RedisCache
from ...services.file_parser import FileParser
from ...schemas.schemas_request import (
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


def processar_arquivo(doc_request: ArquivoComMetadata):

    doc = FileParser(doc_request)

    # try:
    start = time.time()

    start_docs = time.time()
    doc_chunks = doc.processar_arquivo()
    end_docs = time.time()
    print(f"Total Docs: {end_docs - start_docs:.4f}")

    doc_cache = RedisCache(doc_chunks)

    start_emb = time.time()
    embeddings = doc_cache.cache_documents()
    end_emb = time.time()
    print(f"Total Embs: {end_emb - start_emb:.4f}")

    end = time.time()

    print(f"Total: {end - start:.4f}")

    print(f"Arquivo processado e cacheado com sucesso. Embeddings: {len(embeddings)}")

    # except Exception as e:
    #     print(f"Erro ao processar arquivo: {e}")


@router.post("/sendfiles")
async def receive_files(
    background_tasks: BackgroundTasks,
    id_arquivo: UUID = Form(...),
    sessao: str = Form(...),
    file: UploadFile = File(...),
):
    doc_content = await file.read()
    f = io.BytesIO(doc_content)
    f.seek(0)

    doc_request = ArquivoComMetadata(
        id_arquivo=str(id_arquivo), sessao=sessao, file=file, file_content=f
    )

    background_tasks.add_task(processar_arquivo, doc_request)

    return RetornoRequest(
        status=200,
        documento=criar_documento_retorno(doc_request),
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
