import logging
import time

from rq import get_current_job
from fastapi import HTTPException, status

from ..schemas.schemas_request import Response
from ..domain.file_dto import MetadataFile

from ..services.file_parser import FileParser
from ..services.pinecone_db import PineconeConnection

from .redis import Redis

logger = logging.getLogger(__name__)
redis=Redis()
pinecone = PineconeConnection()


def processar_arquivo(doc_request: MetadataFile):
    start = time.time()

    try:
        fileParser = FileParser(doc_request)
        doc_chunks = fileParser.processar_arquivo()

        if doc_chunks and len(doc_chunks) > 0:
            pinecone.armazenar_embeddings(doc_chunks=doc_chunks)

            redis.set_file_status(file_id=doc_request.file_id, status="completed")
            redis.set_files_cache(file=doc_request)
    except Exception as e:
        logger.exception("Erro ao processar arquivo: %s", e)
        redis.set_file_status(file_id=doc_request.file_id, status="error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=Response(mensagem="Não foi possível processar o arquivo."),
        )

    get_current_job().delete()

    end = time.time()
    logger.info(f"Tempo total de processamento: {end - start:.4f}")
