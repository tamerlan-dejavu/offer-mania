from pydantic import BaseModel


class OnboardingRequest(BaseModel):
    target_role: str
    stack: list[str]
    experience_level: str
    focus_areas: list[str]
