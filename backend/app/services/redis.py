import logging
import redis as r

from rq import Queue, Retry

from fastapi import HTTPException, status
from typing import Callable, Iterable

from langchain_community.storage import RedisStore
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_classic.embeddings import CacheBackedEmbeddings

from ..core.config import config
from ..core.embeddings import embeddings

from ..schemas.schemas_request import Response

from ..domain.file_dto import MetadataFile

logger = logging.getLogger(__name__)


class Redis:
    def __init__(self):
        self.redis_pool = r.BlockingConnectionPool(
            host=config.REDIS_HOST_NAME,
            port=config.REDIS_PORT,
            password=config.REDIS_PASSWORD,
            decode_responses=False,
            max_connections=5,
            timeout=20,
        )
        self.redis_client = r.Redis(connection_pool=self.redis_pool)
        self._queque = Queue(
            name="task-queue",
            connection=self.redis_client,
            default_timeout=3600,
        )

    def get_redis_pool(self):
        return self.redis_pool

    def get_redis_client(self):
        return self.redis_client

    def set_task(self, func: Callable, args: Iterable):
        self._queque.enqueue(func, args, retry=Retry(max=3, interval=10))

    def get_files_cache(self, session_id: str):
        files_cache = self.redis_client.json().get(f"session:{session_id}", ".")

        if files_cache:
            return files_cache
        return []

    def set_files_cache(self, file: MetadataFile):
        session_id = file.session
        files_cache = self.get_files_cache(session_id=session_id)

        file_dict = {
            "status": self.get_file_status(file_id=file.file_id),
            "document": {
                "file_id": file.file_id,
                "session": file.session,
                "filename": file.filename,
                "content_type": file.content_type,
                "tamanho": file.size,
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
        except Exception as e:
            logger.exception("Erro ao setar o cache dos arquivos: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor",
            )

    def delete_file_from_cache(self, session_id: str, file_id: str):
        key = f"session:{session_id}"

        try:
            files_cache = self.get_files_cache(session_id=session_id)

            if files_cache:
                updated_cache = [
                    item for item in files_cache
                    if str(item.get("document", {}).get("file_id")) != str(file_id)
                ]

                if len(files_cache) != len(updated_cache):
                    self.redis_client.json().set(key, ".", updated_cache)

            self.redis_client.delete(f"file:{file_id}:status")

        except Exception as e:
            logger.exception("Erro ao deletar arquivo %s do cache: %s", file_id, e)

    def set_file_status(self, file_id: str, status: str):
        self.redis_client.set(f"file:{file_id}:status", status, ex=86400)

    def get_file_status(self, file_id: str) -> str:
        status_bytes = self.redis_client.get(f"file:{file_id}:status")

        if status_bytes:
            return status_bytes.decode("utf-8")

        return "processing"

    def get_chat_history(self, session_id: str):
        return RedisChatMessageHistory(
            session_id=session_id,
            url=config.REDIS_CHAT_URL,
            ttl=86400,
        )

    def get_cached_embedder(self, *, namespace: str):
        documents_cache = RedisStore(client=self.redis_client, ttl=86400)
        embedding = embeddings.voyage_embeddings
        batch_size = 128

        return CacheBackedEmbeddings.from_bytes_store(
            document_embedding_cache=documents_cache,
            underlying_embeddings=embedding,
            batch_size=batch_size,
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
