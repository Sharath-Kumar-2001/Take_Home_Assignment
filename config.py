from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PRODUCTION: bool
    ADMIN_PASSWORD: str
    ADMIN_USERNAME: str
    OPENAI_API_KEY: str
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()