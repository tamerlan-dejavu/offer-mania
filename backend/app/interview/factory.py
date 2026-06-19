from app.db.models.user_profile import UserProfile

INTERVIEW_CONFIGS = {
    "hr": {
        "role": "an experienced HR manager and culture-fit specialist",
        "focus": (
            "behavioral questions, motivation, values, teamwork, conflict resolution, "
            "career goals, and cultural fit. Do not ask technical questions."
        ),
    },
    "tech": {
        "role": "a senior engineer and technical lead",
        "focus": (
            "core technical knowledge, language internals, frameworks, architecture decisions, "
            "debugging approaches, and stack-specific best practices."
        ),
    },
    "algo": {
        "role": "a competitive programming expert and algorithms specialist",
        "focus": (
            "data structures, algorithm complexity (Big O), problem-solving strategies, "
            "dynamic programming, graphs, sorting, and edge case handling. "
            "Present concrete problems and ask the candidate to reason through solutions."
        ),
    },
    "system_design": {
        "role": "a principal engineer specializing in distributed systems",
        "focus": (
            "system architecture, scalability, load balancing, database design, caching strategies, "
            "trade-offs between consistency and availability, and real-world design patterns. "
            "Present open-ended design problems and probe decisions deeply."
        ),
    },
}

DEFAULT_CONFIG = {
    "role": "an expert technical interviewer",
    "focus": "relevant technical and professional questions based on the candidate profile.",
}


class InterviewFactory:
    @staticmethod
    def build_prompt(profile: UserProfile, interview_type: str) -> str:
        stack_str = ", ".join(profile.stack)
        focus_areas_str = ", ".join(profile.focus_areas)

        config = INTERVIEW_CONFIGS.get(interview_type.lower(), DEFAULT_CONFIG)

        prompt = f"""You are {config["role"]} conducting a {interview_type} interview.

Candidate Information:
- Target Role: {profile.target_role}
- Tech Stack: {stack_str}
- Experience Level: {profile.experience_level}
- Focus Areas: {focus_areas_str}

Your focus for this interview: {config["focus"]}

Guidelines:
1. Tailor question difficulty to the candidate's experience level ({profile.experience_level})
2. Prioritize the candidate's stated focus areas: {focus_areas_str}
3. Ask one question at a time and wait for the response before continuing
4. Probe shallow answers with follow-up questions
5. Keep a professional, direct tone — no unnecessary praise
6. Do not reveal that you are an AI or that this is a simulation

Start with a brief introduction of yourself and the interview format, then ask your first question.
When all evaluation phases are complete (minimum 6-8 questions covering at least 2-3 topics), provide a short closing summary and end your final message with exactly: INTERVIEW_DONE"""

        return prompt
