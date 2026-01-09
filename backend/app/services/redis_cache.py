import time
import concurrent.futures
import redis
from langchain_core.documents import Document
from langchain_community.storage import RedisStore
from langchain_classic.embeddings import CacheBackedEmbeddings
from langchain_voyageai.embeddings import VoyageAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_huggingface.embeddings import HuggingFaceEmbeddings

from ..config.config import settings


class RedisCache:
    def __init__(self, doc_chunks: list[Document]):
        self.doc_chunks = doc_chunks

        self.voyage_embeddings = VoyageAIEmbeddings(
            model="voyage-3.5", api_key=settings.VOYAGE_API_KEY
        )

        self.gemini_embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001", api_key=settings.GOOGLE_API_KEY
        )

        # self.bge_embedder = HuggingFaceEmbeddings(
        #     model_name="all-MiniLM-L6-v2",
        #     model_kwargs={"device": "cpu"},
        #     encode_kwargs={"normalize_embeddings": True},
        # )

        self.r = redis.Redis(
            host=settings.REDIS_HOST_NAME,
            port=16006,
            decode_responses=False,
            username="default",
            password=settings.REDIS_PASSWORD,
        )

        self.redis_store = RedisStore(client=self.r)

        self.cached_embeddings = CacheBackedEmbeddings.from_bytes_store(
            # underlying_embeddings=self.gemini_embeddings,
            # underlying_embeddings=self.bge_embedder,
            underlying_embeddings=self.voyage_embeddings,
            document_embedding_cache=self.redis_store,
            namespace="voyage_cache",
            key_encoder="sha256",
            batch_size=128,
        )

    def cache_documents(self):
        start_time_docs = time.time()
        conteudo_documentos = [doc.page_content for doc in self.doc_chunks]
        embeddings = []
        batches = [
            conteudo_documentos[i : i + 128]
            for i in range(0, len(conteudo_documentos), 128)
        ]


        # for i in range(0, len(conteudo_documentos), batch_size):
        #     batch = conteudo_documentos[i:i + batch_size]

        #     # O embed_documents já lida com o Redis (CacheBackedEmbeddings)
        #     # Se estiver no cache, é instantâneo. Se não, calcula na CPU.
        #     batch_embeddings = self.cached_embeddings.embed_documents(batch)
        #     embeddings.extend(batch_embeddings)

        def gen_embeddings(batch):
            return self.cached_embeddings.embed_documents(batch)

        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            results = list(executor.map(gen_embeddings, batches))
            embeddings.extend(results)


        end_time_docs = time.time()

        print(
            f"Tempo para embeddings dos documentos (Cache/Geração): {end_time_docs - start_time_docs:.4f} segundos"
        )

        return embeddings
