from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    REDIS_HOST_NAME: str
    REDIS_PASSWORD: str
    GOOGLE_API_KEY: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
