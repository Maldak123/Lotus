import redis as r

from fastapi import HTTPException, status

from langchain_community.storage import RedisStore
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_classic.embeddings import CacheBackedEmbeddings

from ..config.config import config
from ..config.embeddings import embeddings

from ..schemas.schemas_request import MetadataFile, Response


class Redis:
    def __init__(self):
        self.redis_client = self.get_redis_client(
            host=config.REDIS_HOST_NAME,
            port=config.REDIS_PORT,
            password=config.REDIS_PASSWORD,
        )
        self._redis_store = RedisStore(client=self.redis_client, ttl=86400)
        self._batch_size = 128

    def get_redis_client(self, *, host: str, port: int, password: str):
        return r.Redis(
            host=host,
            port=port,
            decode_responses=True,
            username="default",
            password=password,
        )

    def get_files_cache(self, session_id: str):
        return self.redis_client.json().get(f"session:{session_id}", ".")

    def set_files_cache(self, session_id: str, file: MetadataFile):
        files_cache = self.get_files_cache(session_id=session_id)

        file_dict = {
            "status": self.get_file_status(file_id=file.file_id),
            "document": {
                "file_id": file.file_id,
                "session": file.session,
                "filename": file.file.filename,
                "content_type": file.file.content_type,
                "tamanho": file.file.size,
            },
        }

        try:
            if not files_cache:
                self.redis_client.json().set(f"session:{session_id}", ".", [])
                self.redis_client.json().arrappend(
                    f"session:{session_id}", ".", file_dict
                )
            else:
                self.redis_client.json().arrappend(
                    f"session:{session_id}", ".", file_dict
                )
        except Exception:
            self.set_file_status(file_id=file.file_id, status="error")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor",
            )

    def set_file_status(self, file_id: str, status: str):
        self.redis_client.set(f"file:{file_id}:status", status, ex=86400)

    def get_file_status(self, file_id: str) -> str:
        status_bytes = self.redis_client.get(f"file:{file_id}:status")

        if status_bytes:
            return status_bytes

    def get_chat_history(self, session_id: str):
        return RedisChatMessageHistory(
            session_id=session_id,
            url=config.REDIS_CHAT_URL,
            ttl=86400,
        )

    def get_cached_embedder(self, *, namespace: str):
        documents_cache = self._redis_store
        embedding = embeddings.voyage_embeddings

        return CacheBackedEmbeddings.from_bytes_store(
            document_embedding_cache=documents_cache,
            underlying_embeddings=embedding,
            batch_size=self._batch_size,
            key_encoder="sha256",
            namespace=namespace,
        )

    def _delete_by_pattern(self, pattern: str, error_msg: str):
        keys_to_delete = [key for key in self.redis_client.scan_iter(match=pattern)]

        if keys_to_delete:
            self.redis_client.delete(*keys_to_delete)
            return Response(mensagem="Arquivo removido.")
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=Response(mensagem=error_msg).model_dump(),
            )

    def delete_session_cache(self, session_id: str):
        pattern = f"*{session_id}:*"
        return self._delete_by_pattern(pattern, "Sessão não encontrada no cache.")


redis = Redis()
