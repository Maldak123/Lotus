import time

from fastapi import HTTPException, status

from ..schemas.schemas_request import MetadataFile, Response
from ..services.file_parser import FileParser
from ..services.pinecone_db import pinecone


def processar_arquivo(doc_request: MetadataFile):
    start = time.time()

    try:
        fileParser = FileParser(doc_request)
        doc_chunks = fileParser.processar_arquivo()

        if doc_chunks and len(doc_chunks) > 0:
            pinecone.armazenar_embeddings(doc_chunks=doc_chunks)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=Response(
                status=500, mensagem="Não foi possível processar o arquivo."
            ),
        )

    end = time.time()
    print(f"Tempo total de processamento: {end - start:.4f}")
