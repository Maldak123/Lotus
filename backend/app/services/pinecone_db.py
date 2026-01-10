import concurrent.futures
import time

from fastapi import HTTPException, status

from pinecone import Pinecone, ServerlessSpec

from langchain_core.documents import Document
from langchain_pinecone.vectorstores import PineconeVectorStore

from ..utils.create_cached_embeddings import create_cache_backed_embeddings
from ..utils.get_redis import get_redis_store

from ..config.embeddings import embeddings
from ..config.config import config

from ..schemas.schemas_request import ReturnRequest


class PineconeConnection:
    def __init__(
        self,
    ):
        self.pc = Pinecone(api_key=config.PINECONE_API_KEY)
        self.index_name = "lotus"
        self.verify_and_create_index()
        self.index = self.pc.Index(self.index_name)

    def verify_and_create_index(self):
        d = 1024

        if not self.pc.has_index(self.index_name):
            self.pc.create_index(
                name=self.index_name,
                dimension=d,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            print(f"Índice {self.index_name} criado.")
        else:
            print(f"Conectando-se a {self.index_name}")

    def armazenar_embeddings(self, doc_chunks: list[Document]):
        session_id = doc_chunks[0].metadata.get("session_id")
        file_id = doc_chunks[0].metadata.get("file_id")
        unified_namespace = f"{session_id}:{file_id}"

        embedder = create_cache_backed_embeddings(
            document_embedding_cache=get_redis_store(),
            underlying_embeddings=embeddings.voyage_embeddings,
            namespace=unified_namespace,
        )

        vectorstore = PineconeVectorStore(
            embedding=embedder,
            index_name=self.index_name,
            pinecone_api_key=config.PINECONE_API_KEY,
            namespace=unified_namespace,
        )
        batches = [doc_chunks[i : i + 128] for i in range(0, len(doc_chunks), 128)]

        def armazenar_vectorstore(lote: list[Document]):
            try:
                vectorstore.add_documents(documents=lote, batch_size=32)
            except Exception as e:
                print(e)

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            start = time.time()
            list(executor.map(armazenar_vectorstore, batches))
            end = time.time()
            print(f"Tempo Pinecone: {end - start:.4f}")

        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    def delete_document(self, session_id: str, file_id: str):
        namespace = f"{session_id}:{file_id}"
        try:
            self.index.delete_namespace(namespace=namespace)
            return ReturnRequest(status=200, mensagem=f"Documento {namespace} removido")
        except Exception as e:
            print(f"Erro ao deletar namespace: {e}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ReturnRequest(
                    status=404, mensagem="Arquivo não encontrado no Pinecone."
                ).model_dump(),
            )

    def delete_session(self, session_id: str):
        try:
            stats = self.index.describe_index_stats()
            all_namespaces = stats.get("namespaces", {}).keys()

            targets = [ns for ns in all_namespaces if ns.startswith(f"{session_id}:")]

            for ns in targets:
                self.index.delete_namespace(namespace=ns)

            return ReturnRequest(status=200, mensagem=f"Sessão {session_id} removida.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao limpar sessão: {e}")


pinecone = PineconeConnection()
