import fitz
from rapidocr_onnxruntime import RapidOCR
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from ..schemas.schemas_request import MetadataFile

class FileParser:
    def __init__(self, file: MetadataFile):
        self.file = file
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
            separators=["\n\n", "\n", " ", ""]
        )
        self.ocr = RapidOCR()

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

        ocr_result, _ = self.ocr(img_bytes)

        if ocr_result:
            return "\n".join([item[1] for item in ocr_result])
        return ""

    def processar_arquivo(self):
        docs = []

        with fitz.open(stream=self.file.file_content, filetype="pdf") as pdf:

            for i, page in enumerate(pdf):
                page_text = page.get_text()

                if self._tem_texto_corrompido(page_text):
                    pix = page.get_pixmap(dpi=150)
                    page_text = self._extrair_texto_ocr(pix)

                if page_text.strip():
                    metadados = {
                        "source": self.file.file.filename,
                        "file_id": self.file.file_id,
                        "session_id": self.file.session,
                        "page_number": i + 1,
                    }
                    docs.append(Document(page_content=page_text, metadata=metadados))

        doc_chunks = self.text_splitter.split_documents(docs)
        return doc_chunks