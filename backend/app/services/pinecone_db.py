import concurrent.futures

from fastapi import HTTPException, status

from pinecone import Pinecone, ServerlessSpec
from pinecone_text.sparse import BM25Encoder

from langchain_core.documents import Document
from langchain_classic.embeddings import CacheBackedEmbeddings
from langchain_community.retrievers import PineconeHybridSearchRetriever

from .redis_cache import cache_redis

from ..config.config import config
from ..schemas.schemas_request import Response


class PineconeConnection:
    def __init__(
        self,
    ):
        self.pc = Pinecone(api_key=config.PINECONE_API_KEY)
        self.index_name = config.PINECONE_INDEX_NAME
        self._verify_and_create_index()
        self.index = self.pc.Index(self.index_name)
        self.bm25_encoder = BM25Encoder().default()
        self.batch_size = 128

    def _verify_and_create_index(self) -> None:
        if not self.pc.has_index(self.index_name):
            self.pc.create_index(
                name=self.index_name,
                dimension=1024,
                metric="dotproduct",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            print(f"Índice {self.index_name} criado.")
        else:
            print(f"Conectando-se a {self.index_name}")

    def get_vectorstore(self, *, embedder: CacheBackedEmbeddings) -> PineconeHybridSearchRetriever:
        return PineconeHybridSearchRetriever(
            embeddings=embedder,
            sparse_encoder=self.bm25_encoder,
            index=self.index,
            top_k=5,
            alpha=0.5
        )

    def _armazenar_vectorstore(self, batch: list[Document]) -> None:
        session_id = batch[0].metadata.get("session_id")

        embedder = cache_redis.get_cached_embedder(unified_namespace=session_id)
        vectorstore = self.get_vectorstore(embedder=embedder)

        try:
            vectorstore.add_documents(documents=batch, namespace=session_id)
        except Exception as e:
            return HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Response(
                    status=500, mensagem=f"Erro ao armazenar file: {e}"
                ).model_dump(),
            )

    def armazenar_embeddings(self, doc_chunks: list[Document]) -> None:
        batches = [
            doc_chunks[i : i + self.batch_size]
            for i in range(0, len(doc_chunks), self.batch_size)
        ]

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            list(executor.map(self._armazenar_vectorstore, batches))

    def delete_document(self, session_id: str, file_id: str):
        try:
            self.index.delete(
                namespace=session_id,
                filter={"file_id": file_id}
            )
            return Response(status=200, mensagem=f"Documento {file_id} removido")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Response(
                    status=500, mensagem=f"Erro ao deletar file: {e}"
                ).model_dump(),
            )

    def delete_session(self, session_id: str) -> Response:
        try:
            stats = self.index.describe_index_stats()

            all_namespaces = stats.get("namespaces", {}).keys()
            targets = [ns for ns in all_namespaces if ns.startswith(f"{session_id}:")]

            for ns in targets:
                self.index.delete_namespace(namespace=ns)

            return Response(status=200, mensagem=f"Sessão {session_id} removida.")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Response(
                    status=500, mensagem=f"Erro ao deletar sessão: {e}"
                ).model_dump(),
            )


pinecone = PineconeConnection()
