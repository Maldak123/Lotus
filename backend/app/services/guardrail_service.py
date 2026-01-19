import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser

from ..core.prompts import prompts
from ..core.config import config

logger = logging.getLogger(__name__)

class GuardrailService:
    def __init__(self):
        self._llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            api_key=config.GOOGLE_API_KEY,
            temperature=0.0
        )
        self._chain = prompts.get_guardrail_prompt() | self._llm | StrOutputParser()

    def validate_input(self, message: str) -> bool:
        try:
            result = self._chain.invoke({"input": message})
            cleaned_result = result.strip().upper()

            if "UNSAFE" in cleaned_result or "INSEGURA" in cleaned_result:
                logger.warning(f"Guardrail bloqueou mensagem: {message}")
                return False

            return True
        except Exception as e:
            logger.error("Erro ao executar Guardrail: %s", e)
            return False