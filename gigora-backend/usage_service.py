from datetime import date
from database import supabase

FREE_LIMIT = 5

def check_usage(user_id="test_user"):
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

    if count >= FREE_LIMIT:
        return {
            "allowed": False,
            "remaining": 0
        }

    return {
        "allowed": True,
        "remaining": FREE_LIMIT - count
    }


def increment_usage(user_id="test_user"):
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
        