from app.core.config import settings
from app.llm.base import LLMBase
from google import genai

class GeminiLLM(LLMBase):
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.client = genai.Client()

    def send_response(self, user_message, user_history):
        response = self.client.models.generate_content(
            model="gemini-3.5-flash",
            contents=user_history
        )
        return response.text
