import redis

from fastapi import HTTPException, status
from langchain_community.storage import RedisStore

from ..config.config import config
from ..schemas.schemas_request import Response


class RedisCaching:
    def __init__(self):
        self.redis_client = self._get_redis_client()
        self.redis_store = self.get_redis_store()

    def _get_redis_client(self):
        return redis.Redis(
            host=config.REDIS_HOST_NAME,
            port=config.REDIS_PORT,
            decode_responses=False,
            username="default",
            password=config.REDIS_PASSWORD,
        )

    def get_redis_store(self):
        return RedisStore(client=self.redis_client)

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


redis = RedisCaching()
