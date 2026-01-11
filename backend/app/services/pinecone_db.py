import concurrent.futures

from fastapi import HTTPException, status

from pinecone import Pinecone, ServerlessSpec

from langchain_core.documents import Document
from langchain_classic.embeddings import CacheBackedEmbeddings
from langchain_pinecone.vectorstores import PineconeVectorStore

from .redis_cache import redis

from ..config.embeddings import embeddings
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
        self.batch_size = 128

    def _verify_and_create_index(self):
        if not self.pc.has_index(self.index_name):
            self.pc.create_index(
                name=self.index_name,
                dimension=1024,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            print(f"Índice {self.index_name} criado.")
        else:
            print(f"Conectando-se a {self.index_name}")

    def _armazenar_vectorstore(self, batch: list[Document]):
        session_id = batch[0].metadata.get("session_id")
        file_id = batch[0].metadata.get("file_id")
        unified_namespace = f"{session_id}:{file_id}"

        embedder = CacheBackedEmbeddings.from_bytes_store(
            document_embedding_cache=redis.get_redis_store(),
            underlying_embeddings=embeddings.voyage_embeddings,
            batch_size=self.batch_size,
            key_encoder="sha256",
            namespace=unified_namespace,
        )

        vectorstore = PineconeVectorStore(
            index_name=self.index_name,
            pinecone_api_key=config.PINECONE_API_KEY,
            embedding=embedder,
            namespace=unified_namespace,
        )

        try:
            vectorstore.add_documents(documents=batch)
        except Exception as e:
            return HTTPException(
                status_code=500,
                detail=Response(
                    status=500, mensagem=f"Erro ao armazenar file: {e}"
                ).model_dump(),
            )

    def armazenar_embeddings(self, doc_chunks: list[Document]):
        batches = [
            doc_chunks[i : i + self.batch_size]
            for i in range(0, len(doc_chunks), self.batch_size)
        ]

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            list(executor.map(self._armazenar_vectorstore, batches))

    def delete_document(self, session_id: str, file_id: str):
        namespace = f"{session_id}:{file_id}"

        try:
            self.index.delete_namespace(namespace=namespace)
            return Response(status=200, mensagem=f"Documento {namespace} removido")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Response(
                    status=500, mensagem=f"Erro ao deletar file: {e}"
                ).model_dump(),
            )

    def delete_session(self, session_id: str):
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
