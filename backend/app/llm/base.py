from abc import ABC, abstractmethod

class LLMBase(ABC):
    @abstractmethod
    def send_response(self, user_message, user_history):
        pass