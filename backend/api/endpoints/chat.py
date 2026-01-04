from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class MensagemTemplate(BaseModel):
    sender: str
    message: str


class MessageRequest(BaseModel):
    mensagem: str


@router.post("/sendmessage")
async def message(request: MessageRequest):
    # userTemplate = MensagemTemplate(sender="user", message=request.mensagem)
    systemTemplate = MensagemTemplate(sender="system", message="recebido")

    return {"system": systemTemplate}
