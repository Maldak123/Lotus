from typing import Optional
from pydantic import BaseModel


class MensagemTemplate(BaseModel):
    session_id: str
    type: str
    content: str
    filenames: Optional[list[str]] = None
