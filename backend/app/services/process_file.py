import logging
import time

from fastapi import HTTPException, status

from ..schemas.schemas_request import MetadataFile, Response

from ..services.file_parser import FileParser
from ..services.pinecone_db import pinecone
from .redis import redis

logger = logging.getLogger(__name__)


def processar_arquivo(doc_request: MetadataFile):
    start = time.time()
    redis.set_file_status(file_id=doc_request.file_id, status="processing")
    redis.set_files_cache(session_id=doc_request.session, file=doc_request)

    try:
        fileParser = FileParser(doc_request)
        doc_chunks = fileParser.processar_arquivo()

        if doc_chunks and len(doc_chunks) > 0:
            pinecone.armazenar_embeddings(doc_chunks=doc_chunks)
            redis.set_file_status(file_id=doc_request.file_id, status="completed")
    except Exception:
        redis.set_file_status(file_id=doc_request.file_id, status="error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=Response(mensagem="Não foi possível processar o arquivo."),
        )

    end = time.time()
    logger.debug(f"Tempo total de processamento: {end - start:.4f}")
