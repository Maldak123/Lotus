import io

from uuid import UUID

from fastapi import (
    BackgroundTasks,
    UploadFile,
    File,
    Form,
    APIRouter,
    HTTPException,
    status,
)

from ...services.pinecone_db import pinecone
from ...services.process_file import processar_arquivo

from ...schemas.schemas_request import (
    MetadataFile,
    RemoveFileRequest,
    Response,
)

from ...utils.create_req_return import create_request_return
from ...utils.validations import validations


router = APIRouter()


@router.post("/sendfiles")
async def receive_files(
    background_tasks: BackgroundTasks,
    file_id: UUID = Form(...),
    session: str = Form(...),
    file: UploadFile = File(...),
):
    error_msg = None
    if validations.validate_file_size(file.size):
        error_msg = "Os documentos devem ter no máximo 5MB."
    elif not validations.validate_mimetype(file.content_type):
        error_msg = "Arquivo inválido."
    elif not validations.validate_session(session):
        error_msg = "ID de sessão inválido."

    if error_msg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=Response(
                status=400,
                mensagem=error_msg,
                documento=create_request_return(
                    MetadataFile(file_id=str(file_id), session=session, file=file)
                ),
            ).model_dump(),
        )

    doc_bytes = await file.read()
    f = io.BytesIO(doc_bytes)
    f.seek(0)

    doc_request = MetadataFile(
        file_id=str(file_id), session=session, file=file, file_content=f
    )

    background_tasks.add_task(processar_arquivo, doc_request)

    return Response(
        status=200,
        documento=create_request_return(doc_request),
    ).model_dump()


@router.delete("/removefile")
async def remove_file(request: RemoveFileRequest):
    pinecone.delete_document(request.session_id, request.file_id)

    return Response(status=200, mensagem="Arquivo removido.").model_dump()
