from langchain_core.documents import Document
from langchain_unstructured import UnstructuredLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from ..schemas.schemas_request import MetadataFile


class FileParser:
    def __init__(self, file: MetadataFile):
        self.file = file
        self.loader = UnstructuredLoader(
            file=self.file.file_content,
            metadata_filename=self.file.file.filename,
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
                "source": self.file.file.filename,
                "file_id": self.file.file_id,
                "session_id": self.file.session,
                "page_number": doc.metadata.get("page_number"),
                "sheet_name": doc.metadata.get("sheet_name"),
            }

            metadados = {k: v for k, v in metadados.items() if v is not None}
            docs.append(Document(page_content=doc.page_content, metadata=metadados))

        doc_chunks: list[Document] = self.text_splitter.split_documents(docs)

        return doc_chunks
