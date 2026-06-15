from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str
    database_url: str
    app_env : str = "development"

    class Config:
        env_file = ".env"

settings = Settings()