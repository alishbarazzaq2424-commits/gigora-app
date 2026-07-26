import time

def score_proposal(text):
    score = 0
    text = text.lower()

    if len(text) > 250:
        score += 25

    keywords = [
        "experience",
        "project",
        "client",
        "thank",
        "solution",
        "deliver",
        "quality"
    ]

    for word in keywords:
        if word in text:
            score += 10

    return score


def compare_models(results):
    for result in results:
        result["score"] = score_proposal(result["proposal"])

    winner = max(results, key=lambda x: x["score"])

    return {
        "winner": winner["model"],
        "results": results
    }
