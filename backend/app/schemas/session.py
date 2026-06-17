from pydantic import BaseModel


class CreateSessionRequest(BaseModel):
    mode: str


class SessionResponse(BaseModel):
    session_id: str
    status: str
