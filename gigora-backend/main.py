from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import supabase
from ai_service import (
    generate_proposal,
    analyze_profile,
    optimize_gig
)

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
    result = generate_proposal(data["job_description"])

    return {
        "proposal": result
    }


@app.post("/api/profile")
def profile_analyzer(data: dict):
    result = analyze_profile(data["profile_text"])

    return result


@app.post("/api/seo")
def seo_optimizer(data: dict):
    result = optimize_gig(
        data["title"],
        data["description"]
    )

    return {
        "optimized_content": result
    }
    