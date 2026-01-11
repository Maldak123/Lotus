import time

from ..schemas.schemas_request import MetadataFile

from ..services.file_parser import FileParser
from ..services.pinecone_db import pinecone


def processar_arquivo(doc_request: MetadataFile):
    start = time.time()

    fileParser = FileParser(doc_request)
    doc_chunks = fileParser.processar_arquivo()

    pinecone.armazenar_embeddings(doc_chunks=doc_chunks)

    end = time.time()
    print(f"Tempo total de processamento: {end - start:.4f}")
