from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import supabase
from ai_service import (
    generate_proposal,
    analyze_profile,
    optimize_gig
)

from database import supabase

def save_history(user_id, type, input_text, output):
    try:
        response = supabase.table("history").insert({
            "user_id": user_id,
            "type": type,
            "input_text": str(input_text)[:500],
            "output": str(output)
        }).execute()
    except Exception as e:
        print("History Save Error:", e)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Gigora Backend is running!"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/test-supabase")
def test_supabase():
    return {"message": "Supabase connected successfully"}


@app.post("/api/proposal")
def create_proposal(data: dict):
    result = generate_proposal(
        job_post=data.get("job_description", ""),
        tone=data.get("tone", "Professional"),
        skill=data.get("skill", "Web Development"),
        platform=data.get("platform", "Upwork"),
        length=data.get("length", "medium")
    )

    save_history(
        "test_user",
        "proposal",
        data.get("job_description", ""),
        result
    )

    return result


@app.post("/api/profile")
def profile_analyzer(data: dict):
    result = analyze_profile(data["profile_text"])

    save_history(
        "test_user",
        "profile",
        data["profile_text"],
        result
    )

    return result


@app.post("/api/seo")
def seo_optimizer(data: dict):
    title = data.get("title", "")
    description = data.get("description", "")
    category = data.get("category", "")

    result = optimize_gig(
        title,
        description,
        category
    )

    save_history(
        "test_user",
        "seo",
        title,
        result
    )

    return result

