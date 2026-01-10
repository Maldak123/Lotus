import concurrent.futures

from fastapi import HTTPException, status

from langchain_core.documents import Document

from ..utils.create_cached_embeddings import create_cache_backed_embeddings
from ..utils.get_redis import (
    get_redis_client,
    get_redis_store,
)

from ..config.embeddings import embeddings
from ..schemas.schemas_request import ReturnRequest


class RedisCaching:
    def __init__(self):
        self.redis_store = get_redis_store()
        self.redis_client = get_redis_client()

    def cache_documents(self, doc_chunks: list[Document]):
        conteudo_documentos: list[str] = [doc.page_content for doc in doc_chunks]
        batches: list[list[str]] = [
            conteudo_documentos[i : i + 128]
            for i in range(0, len(conteudo_documentos), 128)
        ]

        def gen_embeddings(batch):
            session_id = doc_chunks[0].metadata.get("session_id")
            file_id = doc_chunks[0].metadata.get("file_id")
            unified_namespace = f"{session_id}:{file_id}"

            cached_embeddings = create_cache_backed_embeddings(
                underlying_embeddings=embeddings.voyage_embeddings,
                document_embedding_cache=self.redis_store,
                namespace=unified_namespace,
            )

            return cached_embeddings.embed_documents(batch)

        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            list(executor.map(gen_embeddings, batches))

    def delete_document_cache(self, session_id: str, file_id: str):
        pattern = f"*{session_id}:{file_id}*"
        return self._delete_by_pattern(pattern, "Arquivo não encontrado no cache.")

    def delete_session_cache(self, session_id: str):
        pattern = f"*{session_id}:*"
        return self._delete_by_pattern(pattern, "Sessão não encontrada no cache.")

    def _delete_by_pattern(self, pattern: str, error_msg: str):
        keys_to_delete = [key for key in self.redis_client.scan_iter(match=pattern)]

        if keys_to_delete:
            self.redis_client.delete(*keys_to_delete)
            return ReturnRequest(status=200, mensagem="Arquivo removido.")
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ReturnRequest(status=404, mensagem=error_msg).model_dump(),
            )


redis = RedisCaching()
