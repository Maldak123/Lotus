import redis

from fastapi import HTTPException, status

from langchain_community.storage import RedisStore
from langchain_classic.embeddings import CacheBackedEmbeddings

from ..config.config import config
from ..config.embeddings import embeddings
from ..schemas.schemas_request import Response


class RedisCaching:
    def __init__(self):
        self.redis_store = self.get_redis_embeddings_store()
        self.batch_size = 128

    def get_redis_client(self, *, host: str, port: int, password: str):
        return redis.Redis(
            host=host,
            port=port,
            decode_responses=False,
            username="default",
            password=password,
        )

    def get_redis_embeddings_store(self):
        client = self.get_redis_client(
            host=config.REDIS_HOST_NAME,
            port=config.REDIS_PORT,
            password=config.REDIS_PASSWORD,
        )
        return RedisStore(client=client)

    def get_cached_embedder(self, *, namespace: str):
        return CacheBackedEmbeddings.from_bytes_store(
            document_embedding_cache=cache_redis.get_redis_embeddings_store(),
            underlying_embeddings=embeddings.voyage_embeddings,
            batch_size=self.batch_size,
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
            return Response(status=200, mensagem="Arquivo removido.")
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=Response(status=404, mensagem=error_msg).model_dump(),
            )


cache_redis = RedisCaching()
