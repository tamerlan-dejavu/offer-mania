from pydantic import BaseModel, ConfigDict, Field

class ChatRequest(BaseModel):
    user_message: str