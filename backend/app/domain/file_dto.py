from io import BytesIO
from typing import IO, Optional

from pydantic import BaseModel, ConfigDict


class MetadataFile(BaseModel):
    file_id: str
    session: str
    filename: str
    size: int
    content_type: str
    file_content: Optional[BytesIO] = None

    model_config = ConfigDict(arbitrary_types_allowed=True)
