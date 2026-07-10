from fastapi import FastAPI
from database import supabase
from ai_service import generate_proposal
app = FastAPI()
@app.get("/")
def home():
    return {"message":"Gigora Backend is running!"}
@app.get("/api/health")
def health():
    return {"status":"ok"}
@app.get("/test-supabase")
def test_supabase():
    return {"message":"Supabase connected sucessfully"}
@app.post("/api/proposal")
def create_proposal(data: dict):
    result = generate_proposal(data["job_description"])
    return {
        "proposal":result
    }
