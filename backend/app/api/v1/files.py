import io

from fastapi import (
    Depends,
    APIRouter,
)

from ...services.pinecone_db import PineconeConnection
from ...services.process_file import processar_arquivo
from ...core.redis_client import get_redis

from ...domain.file_dto import MetadataFile

from ...schemas.schemas_request import (
    FileRequest,
    DocumentResponse,
    RemoveFileRequest,
    Response,
)

router = APIRouter()
redis = get_redis()
pinecone = PineconeConnection()


@router.post("/sendfiles")
async def receive_files(file: FileRequest = Depends()):
    doc_bytes = await file.file.read()
    f = io.BytesIO(doc_bytes)
    f.seek(0)

    doc_request = MetadataFile(
        file_id=str(file.file_id),
        session=file.session,
        filename=file.file.filename,
        size=file.file.size,
        content_type=file.file.content_type,
        file_content=f,
    )

    redis.set_task(processar_arquivo, doc_request)
    # background_tasks.add_task(processar_arquivo, doc_request)

    return Response(
        status="processing",
        document=DocumentResponse(
            file_id=doc_request.file_id,
            session=doc_request.session,
            filename=doc_request.filename,
            content_type=doc_request.content_type,
            tamanho=doc_request.size,
        ),
    ).model_dump()


@router.delete("/removefile")
async def remove_file(request: RemoveFileRequest):
    pinecone.delete_document(request.session_id, request.file_id)
    redis.delete_file_from_cache(request.session_id, request.file_id)

    return Response(mensagem="Arquivo removido.").model_dump()


@router.delete("/deletesession")
async def remove_session(session_id: str):
    pinecone.delete_session(session_id=session_id)
    redis.delete_session_cache(session_id=session_id)


@router.get("/getfile/{file_id}")
async def get_file_status(file_id: str):
    status = redis.get_file_status(file_id=file_id)

    return {"file_id": file_id, "status": status}


@router.get("/getsessionfiles/{session_id}")
async def get_session_files(session_id: str):
    return redis.get_files_cache(session_id=session_id)
