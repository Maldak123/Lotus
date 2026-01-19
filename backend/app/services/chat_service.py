import logging

from fastapi import HTTPException, status

from langchain_core.messages import HumanMessage, AIMessage, trim_messages

from langchain_classic.chains.history_aware_retriever import (
    create_history_aware_retriever,
)
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains.retrieval import create_retrieval_chain

from langchain_google_genai import ChatGoogleGenerativeAI

from ..schemas.schemas_request import Response
from ..schemas.schema_chat import MensagemTemplate

from .guardrail_service import GuardrailService
from .pinecone_db import PineconeConnection
from ..core.redis_client import get_redis

from ..core.config import config
from ..core.prompts import prompts

logger = logging.getLogger(__name__)

redis = get_redis()
pinecone = PineconeConnection()


class ChatService:
    def __init__(self, session_id: str, filenames: list[str]):
        self._session_id = session_id
        self.filenames = filenames
        self._retriever = pinecone.get_vectorstore(
            embedder=redis.get_cached_embedder(namespace=session_id),
            namespace=session_id,
        )
        self._gemini = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash", api_key=config.GOOGLE_API_KEY
        )
        self._chat_history = redis.get_chat_history(session_id=session_id)
        self._guardrail = GuardrailService()

    def _create_chain(self):
        contextualize_q_prompt_system = prompts.get_contextualized_q_prompt()
        qa_prompt = prompts.get_qa_prompt()

        history_aware_retriever = create_history_aware_retriever(
            llm=self._gemini,
            retriever=self._retriever.bind(filter={"source": {"$in": self.filenames}}),
            prompt=contextualize_q_prompt_system,
        )

        qa_chain = create_stuff_documents_chain(llm=self._gemini, prompt=qa_prompt)
        rag_chain = create_retrieval_chain(history_aware_retriever, qa_chain)

        return rag_chain

    def _save_chat_history(self, user_msg: str, ai_msg: str):
        user_message = HumanMessage(content=user_msg)
        ai_message = AIMessage(content=ai_msg)

        self._chat_history.add_user_message(message=user_message)
        self._chat_history.add_ai_message(message=ai_message)

    def generate_response(self, message: str):
        is_safe = self._guardrail.validate_input(message)

        if not is_safe:
            block_message = "Desculpe, não posso processar essa solicitação."
            self._save_chat_history(user_msg=message, ai_msg=block_message)

            return MensagemTemplate(
                session_id=self._session_id, type="ai", content=block_message
            )

        history = trim_messages(
            self._chat_history.messages,
            max_tokens=2000,
            strategy="last",
            token_counter=self._gemini,
            include_system=False,
            start_on="human",
        )

        rag_chain = self._create_chain()

        try:
            answer = rag_chain.invoke({"input": message, "chat_history": history})
        except Exception as e:
            logger.exception("Erro na chain: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Response(mensagem="Erro interno do servidor."),
            )

        self._save_chat_history(user_msg=message, ai_msg=answer["answer"])

        return MensagemTemplate(
            session_id=self._session_id, type="ai", content=answer["answer"]
        )
