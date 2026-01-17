from fastapi import APIRouter, HTTPException, status

from ...schemas.schema_chat import MensagemTemplate

from ...services.redis import redis
from ...services.chat_service import ChatService


router = APIRouter()


@router.post("/sendmessage")
async def message(request: MensagemTemplate):
    chat = ChatService(session_id=request.session_id, filenames=request.filenames)
    answer = await chat.generate_response(request.content)

    return answer


@router.get("/getsession/{session_id}")
async def get_session_messages(session_id: str):
    try:
        chat_messages = redis.get_chat_history(session_id=session_id).messages
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor.",
        )

    return chat_messages
