import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


def generate_proposal(job_post: str) -> str:
    try:
        prompt = f"""
        You are an expert freelancer proposal writer.

        Write a professional proposal for this job:

        {job_post}

        Keep it under 200 words.
        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return f"ERROR: {str(e)}"


def analyze_profile(profile_text: str) -> dict:
    try:
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
        return json.loads(response.text)

    except Exception:
        return {
            "score": 7,
            "strengths": ["Profile analyzed"],
            "weaknesses": ["AI service unavailable"],
            "suggestions": ["Try again later"]
        }


def optimize_gig(title: str, description: str) -> str:
    try:
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

    except Exception:
        return "SEO optimization unavailable"
        