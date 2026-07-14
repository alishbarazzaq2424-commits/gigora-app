import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_keys = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"),
    os.getenv("GEMINI_API_KEY_3")
]

api_keys = [key for key in api_keys if key]

if not api_keys:
    raise ValueError("No Gemini API keys found in .env file")

current_key_index = 0


def get_model():
    global current_key_index

    try:
        genai.configure(api_key=api_keys[current_key_index])
        return genai.GenerativeModel("gemini-2.0-flash")

    except Exception as e:
        print("Gemini Setup Error:", e)
        raise e


def generate_proposal(job_post: str) -> str:
    global current_key_index

    try:
        model = get_model()

        prompt = f"""
        You are an expert freelancer proposal writer.

        Write a professional proposal for this job:

        {job_post}

        Keep it under 200 words.
        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("Proposal Error:", e)

        return """
Dear Client,

I reviewed your project requirements and believe I am a strong fit for this work. I have relevant experience and can deliver high-quality results within the required timeline.

I focus on clear communication, timely delivery, and client satisfaction.

Best regards
"""


def analyze_profile(profile_text: str) -> dict:
    try:
        model = get_model()

        prompt = f"""
        Analyze this freelancer profile and return ONLY valid JSON.

        Profile:
        {profile_text}

        Format:
        {{
            "score": 7,
            "strengths": ["point 1", "point 2"],
            "weaknesses": ["point 1", "point 2"],
            "suggestions": ["point 1", "point 2"]
        }}
        """

        response = model.generate_content(prompt)

        text = response.text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        return json.loads(text)

    except Exception as e:
        print("Profile Analysis Error:", e)

        return {
            "score": 7,
            "strengths": ["Profile analyzed"],
            "weaknesses": ["AI service unavailable"],
            "suggestions": ["Try again later"]
        }


def optimize_gig(title: str, description: str) -> str:
    try:
        model = get_model()

        prompt = f"""
        Optimize this Fiverr gig for SEO.

        Title:
        {title}

        Description:
        {description}

        Improve the title and description using relevant keywords.
        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("SEO Optimization Error:", e)

        return """
Optimized Title: Professional WordPress Website Developer

Optimized Description:
I will build a responsive, SEO-friendly, and modern WordPress website tailored to your business needs.
Fast delivery, clean design, and optimized performance included.
"""
