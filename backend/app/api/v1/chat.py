from fastapi import APIRouter
from pydantic import BaseModel

from ...schemas.schema_chat import MensagemTemplate


router = APIRouter()


@router.post("/sendmessage")
async def message(request: MensagemTemplate):
    # userTemplate = MensagemTemplate(sender="user", message=request.mensagem)
    systemTemplate = MensagemTemplate(sender="system", mensagem="recebido")

    print(systemTemplate.model_dump())
    return systemTemplate.model_dump()
