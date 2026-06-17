from pydantic import BaseModel, ConfigDict, Field

class ChatRequest(BaseModel):
    user_message: str
    session_id: str
    interview_type: str = Field(default="tech", description="Interview type: hr, tech, algo, system_design")