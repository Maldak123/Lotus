from fastapi import APIRouter

from ...schemas.schema_chat import MensagemTemplate

from ...services.chat_service import ChatService


router = APIRouter()


@router.post("/sendmessage")
async def message(request: MensagemTemplate):
    chat = ChatService(session_id=request.session_id)
    chat.generate_response(request.mensagem)
