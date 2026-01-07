from fastapi import UploadFile
from langchain_core.documents import Document
from langchain_community.document_loaders import UnstructuredFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


class FileParser:
    def __init__(self, arquivo: UploadFile):
        self.arquivo = arquivo

    def processar_arquivo(self):
        loader = UnstructuredFileLoader(self.arquivo, mode="single")
        doc: list[Document] = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
        )

        doc_chunks: list[Document] = text_splitter.split_documents(doc)

        return doc_chunks
