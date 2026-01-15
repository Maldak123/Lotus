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
        self._pc = Pinecone(api_key=config.PINECONE_API_KEY)
        self._index_name = config.PINECONE_INDEX_NAME
        self._verify_and_create_index()
        self._index = self._pc.Index(self._index_name)
        self._bm25_encoder = BM25Encoder().default()
        self._batch_size = 128

    def get_vectorstore(
        self, *, embedder: CacheBackedEmbeddings, namespace: str
    ) -> PineconeHybridSearchRetriever:
        return PineconeHybridSearchRetriever(
            embeddings=embedder,
            sparse_encoder=self._bm25_encoder,
            namespace=namespace,
            index=self._index,
            top_k=5,
            alpha=0.5,
        )

    def armazenar_embeddings(self, doc_chunks: list[Document]) -> None:
        batches = [
            doc_chunks[i : i + self._batch_size]
            for i in range(0, len(doc_chunks), self._batch_size)
        ]

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            list(executor.map(self._armazenar_vectorstore, batches))

    def delete_document(self, session_id: str, file_id: str):
        try:
            self._index.delete(namespace=session_id, filter={"file_id": file_id})
            return Response(mensagem=f"Documento {file_id} removido")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Response(mensagem=f"Erro ao deletar file: {e}").model_dump(),
            )

    def delete_session(self, session_id: str) -> Response:
        try:
            stats = self._index.describe_index_stats()

            all_namespaces = stats.get("namespaces", {}).keys()
            targets = [ns for ns in all_namespaces if ns.startswith(f"{session_id}:")]

            for ns in targets:
                self._index.delete_namespace(namespace=ns)

            return Response(mensagem=f"Sessão {session_id} removida.")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Response(mensagem=f"Erro ao deletar sessão: {e}").model_dump(),
            )

    def _verify_and_create_index(self) -> None:
        if not self._pc.has_index(self._index_name):
            self._pc.create_index(
                name=self._index_name,
                dimension=1024,
                metric="dotproduct",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            print(f"Índice {self._index_name} criado.")
        else:
            print(f"Conectando-se a {self._index_name}")

    def _armazenar_vectorstore(self, batch: list[Document]) -> None:
        session_id = batch[0].metadata.get("session_id")

        textos = [doc.page_content for doc in batch]
        metadata = [doc.metadata for doc in batch]

        embedder = cache_redis.get_cached_embedder(namespace=session_id)
        vectorstore = self.get_vectorstore(embedder=embedder, namespace=session_id)

        try:
            vectorstore.add_texts(
                texts=textos, metadatas=metadata, namespace=session_id
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Response(mensagem=f"Erro ao armazenar file: {e}").model_dump(),
            )


pinecone = PineconeConnection()
