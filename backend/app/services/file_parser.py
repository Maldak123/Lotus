from langchain_core.documents import Document
from langchain_unstructured import UnstructuredLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from ..schemas.schemas_request import ArquivoComMetadata


class FileParser:
    def __init__(self, arquivo: ArquivoComMetadata):
        self.arquivo = arquivo

    def processar_arquivo(self):

        loader = UnstructuredLoader(
            file=self.arquivo.file_content,
            metadata_filename=self.arquivo.file.filename,
            mode="single",
        )

        data: list[Document] = loader.load()
        docs = []

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
        )

        for doc in data:
            metadados = doc.metadata.copy()
            metadados["source"] = self.arquivo.file.filename
            metadados["file_id"] = self.arquivo.id_arquivo
            metadados["session_id"] = self.arquivo.sessao

            docs.append(Document(page_content=doc.page_content, metadata=metadados))

        doc_chunks: list[Document] = text_splitter.split_documents(docs)

        return doc_chunks
