from langchain_core.documents import Document
from langchain_unstructured import UnstructuredLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from ..schemas.schemas_request import MetadataFile


class FileParser:
    def __init__(self, arquivo: MetadataFile):
        self.arquivo = arquivo
        self.loader = UnstructuredLoader(
            file=self.arquivo.file_content,
            metadata_filename=self.arquivo.file.filename,
            mode="single",
            strategy="fast",
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
        )

    def processar_arquivo(self):
        data: list[Document] = self.loader.load()
        docs = []

        for doc in data:
            metadados = {
                "source": self.arquivo.file.filename,
                "file_id": self.arquivo.file_id,
                "session_id": self.arquivo.session,
                "page_number": doc.metadata.get("page_number"),
                "sheet_name": doc.metadata.get("sheet_name"),
            }

            metadados = {k: v for k, v in metadados.items() if v is not None}
            docs.append(Document(page_content=doc.page_content, metadata=metadados))

        doc_chunks: list[Document] = self.text_splitter.split_documents(docs)

        return doc_chunks
