from app.core.config import settings
from app.llm.base import LLMBase
from google import genai
from google.genai import types
from app.interview.prompts import prompts

class GeminiLLM(LLMBase):
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.client = genai.Client(api_key=self.api_key)

    def send_response(self, user_message, user_history):
        config = types.GenerateContentConfig(
        system_instruction=prompts
)

        response = self.client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=user_message,
            config=config
        )
        return response.text
