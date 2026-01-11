from pathlib import Path
from ..schemas.schemas_request import MetadataFile, DocumentResponse


def create_request_return(doc: MetadataFile) -> DocumentResponse:
    extensao = Path(doc.file.filename).suffix

    return DocumentResponse(
        file_id=doc.file_id,
        session=doc.session,
        filename=doc.file.filename,
        content_type=doc.file.content_type,
        tamanho=doc.file.size,
        extensao=extensao,
    )
