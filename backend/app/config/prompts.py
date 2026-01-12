from langchain_core.prompts import MessagesPlaceholder, ChatPromptTemplate


class Prompts:
    def __init__(self):
        self.system_prompt = (
            "Given a chat history and the latest user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, "
            "just reformulate it if needed and otherwise return it as is."
        )
        self.qa_prompt = (
            "You are an assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer "
            "the question. If you don't know the answer, say that you "
            "don't know."
            "\n\n"
            "{context}"
        )

    def get_contextualized_q_prompt(self):
        return ChatPromptTemplate(
            [
                ("system", self.system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )

    def get_qa_prompt(self):
        return ChatPromptTemplate(
            [
                ("system", self.qa_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )
