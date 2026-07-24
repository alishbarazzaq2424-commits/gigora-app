from datetime import date
from database import supabase

PLAN_LIMITS = {
    "free": {
        "proposal": 5,
        "seo": 5,
        "profile": 3
    },
    "pro": {
        "proposal": 999999,
        "seo": 999999,
        "profile": 999999
    }
}

def is_pro_user(user_id):
    result = (
        supabase.table("users")
        .select("plan")
        .eq("id", user_id)
        .execute()
    )

    if result.data and result.data[0]["plan"] == "pro":
        return True

    return False

def check_usage(user_id="test_user", feature="proposal"):

    plan = "pro" if is_pro_user(user_id) else "free"

    limit = PLAN_LIMITS[plan].get(feature, 5)

    if plan == "pro":
        return {
            "allowed": True,
            "remaining": "Unlimited"
        }

    today = str(date.today())

    result = (
        supabase.table("usage")
        .select("*")
        .eq("user_id", user_id)
        .eq("date", today)
        .execute()
    )

    if result.data:
        count = result.data[0]["count"]
    else:
        count = 0

    if count >= limit:
        return {
            "allowed": False,
            "remaining": 0
        }

    return {
        "allowed": True,
        "remaining": limit - count
    }


def increment_usage(user_id="test_user", feature="proposal"):
    today = str(date.today())

    result = (
        supabase.table("usage")
        .select("*")
        .eq("user_id", user_id)
        .eq("date", today)
        .execute()
    )

    if result.data:
        count = result.data[0]["count"]

        (
            supabase.table("usage")
            .update({"count": count + 1})
            .eq("id", result.data[0]["id"])
            .execute()
        )
    else:
        (
            supabase.table("usage")
            .insert({
                "user_id": user_id,
                "date": today,
                "count": 1
            })
            .execute()
        )
        