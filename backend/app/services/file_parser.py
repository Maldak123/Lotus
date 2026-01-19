import fitz  # PyMuPDF
from rapidocr_onnxruntime import RapidOCR

from langchain_core.documents import Document
from langchain_unstructured import UnstructuredLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from ..domain.file_dto import MetadataFile


class FileParser:
    def __init__(self, file: MetadataFile):
        self._file = file
        self._text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=512, chunk_overlap=50, separators=["\n\n", "\n", " ", ""]
        )
        self._ocr = RapidOCR()

    def _process_unstructured(self) -> list[Document]:
        loader = UnstructuredLoader(
            file=self._file.file_content,
            metadata_filename=self._file.filename,
            strategy="fast",
        )
        data = loader.load()

        docs = []
        for doc in data:
            metadados = {
                "source": self._file.filename,
                "file_id": self._file.file_id,
                "session_id": self._file.session,
                "page_number": doc.metadata.get("page_number"),
                "sheet_name": doc.metadata.get("sheet_name"),
            }

            metadados = {k: v for k, v in metadados.items() if v is not None}
            docs.append(Document(page_content=doc.page_content, metadata=metadados))

        return self._text_splitter.split_documents(docs)

    def _tem_texto_corrompido(self, text: str) -> bool:
        if not text:
            return True
        if "(cid:" in text:
            return True
        if len(text.strip()) < 10:
            return True
        return False

    def _extrair_texto_ocr(self, page_pixmap) -> str:
        img_bytes = page_pixmap.tobytes("png")
        ocr_result, _ = self._ocr(img_bytes)
        if ocr_result:
            return "\n".join([item[1] for item in ocr_result])
        return ""

    def _process_pdf_custom(self) -> list[Document]:
        docs = []

        with fitz.open(stream=self._file.file_content, filetype="pdf") as pdf:
            for i, page in enumerate(pdf):
                page_text = page.get_text()

                if self._tem_texto_corrompido(page_text):
                    pix = page.get_pixmap(dpi=150)
                    page_text = self._extrair_texto_ocr(pix)

                if page_text.strip():
                    metadados = {
                        "source": self._file.filename,
                        "file_id": self._file.file_id,
                        "session_id": self._file.session,
                        "page_number": i + 1,
                    }

                    docs.append(Document(page_content=page_text, metadata=metadados))

        return self._text_splitter.split_documents(docs)

    def processar_arquivo(self) -> list[Document]:
        filename = self._file.filename.lower()

        if filename.endswith(".pdf"):
            return self._process_pdf_custom()
        else:
            return self._process_unstructured()
