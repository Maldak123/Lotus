from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class MensagemTemplate(BaseModel):
    sender: str
    mensagem: str


@router.post("/sendmessage")
async def message(request: MensagemTemplate):
    # userTemplate = MensagemTemplate(sender="user", message=request.mensagem)
    systemTemplate = MensagemTemplate(sender="system", mensagem="recebido")

    print(systemTemplate.model_dump())
    return systemTemplate.model_dump()
