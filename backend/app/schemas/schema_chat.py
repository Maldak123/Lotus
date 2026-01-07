from pydantic import BaseModel


class MensagemTemplate(BaseModel):
    sender: str
    mensagem: str
