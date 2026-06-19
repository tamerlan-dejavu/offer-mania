from app.core.config import settings
from app.llm.base import LLMBase
from google import genai
from google.genai import types
from app.interview.prompts import prompts

class GeminiLLM(LLMBase):
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.client = genai.Client(api_key=self.api_key)

    def send_response(self, user_message: str, user_history: list = None, system_prompt: str = None) -> str:
        if system_prompt is None:
            system_prompt = prompts

        config = types.GenerateContentConfig(
            system_instruction=system_prompt
        )

        contents = []
        if user_history:
            contents.extend(user_history)

        contents.append({"role": "user", "parts": [{"text": user_message}]})
        response = self.client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=contents,
            config=config
        )
        return response.text

    def stream_response(self, user_message: str, user_history: list = None, system_prompt: str = None):
        if system_prompt is None:
            system_prompt = prompts

        config = types.GenerateContentConfig(
            system_instruction=system_prompt
        )

        contents = []
        if user_history:
            contents.extend(user_history)

        contents.append({"role": "user", "parts": [{"text": user_message}]})

        for chunk in self.client.models.generate_content_stream(
            model="gemini-2.5-flash-lite",
            contents=contents,
            config=config
        ):
            if chunk.text:
                yield chunk.text