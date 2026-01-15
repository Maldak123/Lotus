import redis

from fastapi import HTTPException, status

from langchain_community.storage import RedisStore
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_classic.embeddings import CacheBackedEmbeddings

from ..config.config import config
from ..config.embeddings import embeddings
from ..schemas.schemas_request import Response


class RedisCaching:
    def __init__(self):
        self.redis_client = self.get_redis_client(
            host=config.REDIS_HOST_NAME,
            port=config.REDIS_PORT,
            password=config.REDIS_PASSWORD,
        )
        self._redis_store = RedisStore(client=self.redis_client, ttl=86400)
        self._batch_size = 128

    def set_file_status(self, file_id: str, status: str):
        self.redis_client.set(f"file:{file_id}:status", status, ex=600)

    def get_file_status(self, file_id: str) -> str:
        status_bytes = self.redis_client.get(f"file:{file_id}:status")

        if status_bytes:
            return status_bytes.decode("utf-8")
        return "unknown"

    def get_chat_history(self, session_id: str):
        return RedisChatMessageHistory(
            session_id=session_id,
            url=config.REDIS_CHAT_URL,
            ttl=86400,
        )

    def get_redis_client(self, *, host: str, port: int, password: str):
        return redis.Redis(
            host=host,
            port=port,
            decode_responses=False,
            username="default",
            password=password,
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

    def delete_session_cache(self, session_id: str):
        pattern = f"*{session_id}:*"
        return self._delete_by_pattern(pattern, "Sessão não encontrada no cache.")

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


cache_redis = RedisCaching()
