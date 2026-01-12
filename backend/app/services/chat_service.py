from langchain_core.messages import HumanMessage, AIMessage, trim_messages

from langchain_classic.chains.history_aware_retriever import (
    create_history_aware_retriever,
)
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains.retrieval import create_retrieval_chain

from langchain_google_genai import ChatGoogleGenerativeAI

from ..schemas.schema_chat import MensagemTemplate

from .pinecone_db import pinecone
from .redis_cache import cache_redis

from ..config.config import config
from ..config.prompts import Prompts


class ChatService:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.retriever = pinecone.get_vectorstore(
            embedder=cache_redis.get_cached_embedder(namespace=session_id),
            namespace=session_id,
        )
        self.gemini = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash", api_key=config.GOOGLE_API_KEY
        )
        self.chat_history = []

    def _create_chain(self):
        contextualize_q_prompt_system = Prompts().get_contextualized_q_prompt()
        qa_prompt = Prompts().get_qa_prompt()

        history_aware_retriever = create_history_aware_retriever(
            llm=self.gemini,
            retriever=self.retriever,
            prompt=contextualize_q_prompt_system,
        )

        qa_chain = create_stuff_documents_chain(llm=self.gemini, prompt=qa_prompt)

        rag_chain = create_retrieval_chain(history_aware_retriever, qa_chain)

        return rag_chain

    def generate_response(self, message: str):
        history = trim_messages(
            self.chat_history,
            max_tokens=2000,
            strategy="last",
            token_counter=self.gemini,
            include_system=False,
            start_on="human",
        )

        rag_chain = self._create_chain()

        answer = rag_chain.invoke({"input": message, "chat_history": history})

        print(answer)

        return MensagemTemplate(session_id=self.session_id, mensagem=answer["answer"])
