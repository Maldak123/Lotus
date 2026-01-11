import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    REDIS_HOST_NAME: str
    REDIS_PASSWORD: str
    REDIS_PORT: int

    GOOGLE_API_KEY: str
    VOYAGE_API_KEY: str

    PINECONE_API_KEY: str
    PINECONE_HOST_NAME: str
    PINECONE_INDEX_NAME: str

    model_config = SettingsConfigDict(env_file=".env")


config = Config()

# O Pinecone não estava aceitando a key inserida diretamente no código, então tive que setar por aqui
os.environ["PINECONE_API_KEY"] = config.PINECONE_API_KEY
