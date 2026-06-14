from app.core.config import settings
from app.llm.base import LLMBase
from google import genai

class GeminiLLM(LLMBase):
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.client = genai.Client(api_key=self.api_key)

    def send_response(self, user_message, user_history):
        response = self.client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=user_message
        )
        return response.text
