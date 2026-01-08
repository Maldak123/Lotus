import time
import redis
from langchain_core.documents import Document
from langchain_classic.embeddings import CacheBackedEmbeddings
from langchain_community.storage import RedisStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from ..config.config import settings


class RedisCache:
    def __init__(self, doc_chunks: list[Document]):
        self.doc_chunks = doc_chunks

    gemini_embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001", api_key=settings.GOOGLE_API_KEY
    )

    r = redis.Redis(
        host=settings.REDIS_HOST_NAME,
        port=16006,
        decode_responses=False,
        username="default",
        password=settings.REDIS_PASSWORD,
    )

    redis_store = RedisStore(client=r)

    cached_embeddings = CacheBackedEmbeddings.from_bytes_store(
        underlying_embeddings=gemini_embeddings,
        document_embedding_cache=redis_store,
        namespace="gemini_cache",
        key_encoder="sha256",
        batch_size=32,
    )

    def cache_documents(self):
        start_time_docs = time.time()
        embeddings: list[list[float]] = self.cached_embeddings.embed_documents(
            [doc.page_content for doc in self.doc_chunks]
        )
        end_time_docs = time.time()

        print(
            f"Tempo para embeddings dos documentos (Cache/Geração): {end_time_docs - start_time_docs:.4f} segundos"
        )

        return embeddings
