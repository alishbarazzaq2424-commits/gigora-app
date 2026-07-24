from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from database import supabase
from ai_service import (
    generate_proposal,
    analyze_profile,
    optimize_gig
)
from usage_service import check_usage, increment_usage
import re

def sanitize(text: str) -> str:
    clean = re.sub(r"<[^>]+>", "", text)  # remove HTML tags
    clean = clean.strip()

    if not clean:
        raise HTTPException(
            status_code=400,
            detail="Input cannot be empty"
        )

    return clean[:2000]  

security = HTTPBearer()
import os
import stripe
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")

print("ENV FILE LOADED")
print("STRIPE KEY:", repr(os.getenv("STRIPE_SECRET_KEY")))
print("PRICE ID:", repr(os.getenv("STRIPE_PRICE_ID")))
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

def save_history(user_id, type, input_text, output):
    try:
        response = supabase.table("history").insert({
            "user_id": user_id,
            "type": type,
            "input_text": str(input_text)[:500],
            "output": str(output)
        }).execute()

        print("History Saved:", response.data)

    except Exception as e:
        print("History Save Error:", e)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        user = supabase.auth.get_user(token)

        user_id = user.user.id

        user_data = (
            supabase.table("users")
            .select("*")
            .eq("id", user_id)
            .execute()
        )
        print("USER DATA:", user_data.data)

        plan = "free"

        if user_data.data: plan = user_data.data[0].get("plan", "free")

        return {
            "id": user.user.id,
            "email": user.user.email,
            "plan": plan
        }

    except Exception as e:
        print("AUTH ERROR:", e)

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

def check_pro_access(current_user):
    if current_user["plan"] != "pro":
        raise HTTPException(
            status_code=403,
            detail="This feature requires a Pro plan"
        )


app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

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

@app.post("/signup")
def signup(data: dict):

    result = supabase.auth.sign_up({
        "email": "razzaqabdul1218@gmail.com",
        "password": "yasir112233"
    })

    return result


@app.post("/login")
def login():

    result = supabase.auth.sign_in_with_password({   
        "email": "razzaqabdul1218@gmail.com",
        "password": "yasir112233"
    })

    return {
        "access_token": result.session.access_token
    }

@app.post("/api/proposal")
@limiter.limit("20/minute")
def create_proposal(request: Request, data: dict, current_user=Depends(get_current_user)):

    if current_user["plan"] == "free":

        usage = check_usage(current_user["id"], "proposal")

        if not usage["allowed"]:
            raise HTTPException(
                status_code=429,
                detail="Free plan limit reached. Upgrade to Pro."
            )

    result = generate_proposal(
        job_post = sanitize(data.get("job_description", "")),
        tone=data.get("tone", "Professional"),
        skill=data.get("skill", "Web Development"),
        platform=data.get("platform", "Upwork"),
        length=data.get("length", "medium")
    )

    save_history(
        current_user["id"],
        "proposal",
        data.get("job_description", ""),
        result
    )

    increment_usage(current_user["id"], "proposal")

    return result


@app.post("/api/profile")
@limiter.limit("20/minute")
def profile_analyzer(request: Request, data: dict, current_user=Depends(get_current_user)):

    if current_user["plan"] == "free":
        usage = check_usage(current_user["id"], "proposal")

        if not usage["allowed"]:
            raise HTTPException(
                status_code=429,
                detail="Free plan limit reached. Upgrade to Pro."
            )
    
    profile_text = sanitize(data.get("profile_text"))

    result = analyze_profile(profile_text)

    save_history(
        current_user["id"],
        "profile",
        data["profile_text"],
        result
    )

    increment_usage(current_user["id"], "proposal")

    return result


@app.post("/api/seo")
@limiter.limit("20/minute")
def seo_optimizer(request: Request, data: dict, current_user=Depends(get_current_user)):

    if current_user["plan"] == "free":
        usage = check_usage(current_user["id"], "proposal")

        if not usage["allowed"]:
            raise HTTPException(
                status_code=429,
                detail="Free plan limit reached. Upgrade to Pro."
            )

    title = sanitize(data.get("title", ""))
    description = sanitize(data.get("description", ""))
    category = sanitize(data.get("category", ""))

    result = optimize_gig(
        title,
        description,
        category
    )

    save_history(
        current_user["id"],
        "seo",
        title,
        result
    )

    increment_usage(current_user["id"], "proposal")

    return result

@app.get("/api/history")
def get_history(
    current_user=Depends(get_current_user)
):
    try:
        result = (
            supabase.table("history")
            .select("*")
            .order("id", desc=True)
            .limit(20)
            .execute()
        )

        return result.data

    except Exception as e:
        return {"error": str(e)}


@app.delete("/api/history/{history_id}")
def delete_history(history_id: int):

    supabase.table("history") \
        .delete() \
        .eq("id", history_id) \
        .execute()

    return {"message": "Deleted"}


@app.get("/api/stats")
def get_stats(
    current_user=Depends(get_current_user)
):
    try:
        result = (
            supabase.table("history")
            .select("type")
            .execute()
        )

        data = result.data

        return {
            "proposals": len([x for x in data if x["type"] == "proposal"]),
            "seo": len([x for x in data if x["type"] == "seo"]),
            "profiles": len([x for x in data if x["type"] == "profile"]),
            "total": len(data)
        }

    except Exception as e:
        return {"error": str(e)}
        
    
@app.get("/api/usage")
def get_usage(
    current_user=Depends(get_current_user)
):
    from datetime import date

    today = str(date.today())

    result = (
        supabase.table("usage")
        .select("*")
        .eq("user_id", current_user["id"],)
        .eq("date", today)
        .execute()
    )

    used = result.data[0]["count"] if result.data else 0

    return {
        "plan": current_user["plan"],
        "used": used,
        "remaining": "Unlimited" if current_user["plan"] == "pro" else max(0, 5 - used)
    }

@app.get("/api/me")
async def me(
    current_user=Depends(get_current_user)
):
    return current_user

@app.post("/api/payment/checkout")
async def create_checkout(
    current_user=Depends(get_current_user)
):
    try:
        print("DEBUG USER:", current_user)
        print("DEBUG PRICE:", STRIPE_PRICE_ID)

        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[
                {
                    "price": STRIPE_PRICE_ID,
                    "quantity": 1
                }
            ],
            success_url="http://localhost:3000/payment-success",
            cancel_url="http://localhost:3000/payment-cancel"
        )

        return {
            "checkout_url": session.url
        }

    except Exception as e:
        print("STRIPE ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/api/payment/webhook")
async def stripe_webhook():
    return {"ok": True}

@app.post("/api/model-compare")
def model_compare(
    current_user=Depends(get_current_user)
):
    check_pro_access(current_user)

    return {
        "message": "Model comparison available for Pro users"
    }

@app.post("/api/payment/cancel")
def cancel_subscription(
    current_user=Depends(get_current_user)
):
    supabase.table("users").update({
        "plan": "free"
    }).eq(
        "id",
        current_user["id"]
    ).execute()

    return {
        "success": True,
        "message": "Subscription cancelled successfully"
    }
