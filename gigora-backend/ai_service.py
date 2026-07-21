import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

api_keys = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"),
    os.getenv("GEMINI_API_KEY_3")
]

api_keys = [key for key in api_keys if key]
print("Total Gemini Keys Loaded:", len(api_keys))
if not api_keys:
    raise ValueError("No Gemini API keys found in .env file")

current_key_index = 0


def get_model():
    return client

    
def generate_proposal(
    job_post: str,
    tone: str,
    skill: str,
    platform: str,
    length: str
) -> dict:

    try:
        model = get_model()

        word_limits = {
            "short": 100,
            "medium": 200,
            "long": 300
        }

        words = word_limits.get(length.lower(), 200)

        example = """
Hi, I reviewed your project carefully.
With my experience in this field, I can deliver high-quality results within your timeline.
I focus on communication, quality, and client satisfaction.
"""

        prompt = f"""
You are an expert freelancer proposal writer.

Platform: {platform}
Skill: {skill}
Tone: {tone}

Job Post:
{job_post}

Write around {words} words.

Example:
{example}

Return ONLY valid JSON:

{{
"text": "",
"word_count": 0,
"key_points": [
"",
"",
""
]
}}
"""

        response = model.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ],
    max_tokens=800
)

        text = response.choices[0].message.content.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        return json.loads(text)

    except Exception as e:
        print("Proposal Error:", e)

        return {
            "text": "Dear Client, I can help you complete this project with quality work and timely delivery.",
            "word_count": 20,
            "key_points": [
                "Experience",
                "Quality work",
                "Fast delivery"
            ]
        }
        
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

        response = model.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ],
    max_tokens=800
)

        text = response.choices[0].message.content.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        result = json.loads(text)
        return result

    except Exception as e:
        print("Profile Analysis Error:", e)

        return {
            "score": 7,
            "strengths": ["Profile analyzed"],
            "weaknesses": ["AI service unavailable"],
            "suggestions": ["Try again later"]
        }


def optimize_gig(title: str, description: str, category: str) -> dict:
    try:
        model = get_model()

        prompt = f"""
        You are a Fiverr SEO expert.

        Return ONLY valid JSON.

        Category: {category}
        Title: {title}
        Description: {description}

        Format:
        {{
            "optimized_title": "",
            "tags": ["","","","",""],
            "optimized_description": "",
            "scores": {{
                "title": 0,
                "tags": 0,
                "description": 0,
                "overall": 0
            }},
            "tips": ["","",""]
        }}
        """

        response = model.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ],
    max_tokens=800
)

        text = response.choices[0].message.content.strip()

        print("SEO Response:", text)

        if text.startswith("```"):
           text = text.replace("```json", "").replace("```", "").strip()
  
        print("RAW SEO TEXT =", repr(text))

        result = json.loads(text)

        for i, tag in enumerate(result["tags"]):
            words = tag.split()
            
            print("TAG =", repr(tag))
            print("WORDS =", len(words))
            print("LENGTH =", len(tag))
            print("VALID =", 2 <=
        len(words) <= 5 and len(tag) <= 20)


            result["tags"][i] = {
                "text": tag,
                "valid": (
                    2<=len(words) <= 5
                     and len(tag) <= 20
                )
            } 
        valid_tags = sum(
            1 for tag in result["tags"]
            if tag["valid"]
        )
        title_score = 10 if len(result["optimized_title"]) <= 80 else 5
        tag_score = min(valid_tags * 2, 10)
        description_score = (
            10 if 
            len(result["optimized_description"]) >= 100
            else 5
        )
        overall_score = round(
            (title_score + tag_score + description_score) /3
        )
        result["scores"] = {
            "title": title_score,
            "tags": tag_score,
            "description": description_score,
            "overall": overall_score
        }
        return result

    except Exception as e:
        print("SEO Optimization Error:", e)


        return {
            "optimized_title": title,
            "optimized_description": description,
            "tags": [
                {
                    "text": "wordpress website",
                    "valid": True
                },
                {
                    "text": "web design",
                    "valid": True
                }
            ],
            "scores": {
                "title": 0,
                "tags": 0,
                "description": 0,
                "overall": 0
            },
            "tips": ["Try again later"]
        }





