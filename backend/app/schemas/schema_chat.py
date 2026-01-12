from pydantic import BaseModel


class MensagemTemplate(BaseModel):
    session_id: str
    mensagem: str
