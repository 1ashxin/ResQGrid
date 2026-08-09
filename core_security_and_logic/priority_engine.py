"""
ResQGrid Priority Engine

Scores and ranks incoming SOS requests based on urgency.
Higher score = higher priority.
"""


PRIORITY_RULES = {
    "trapped": 40,
    "critical": 40,
    "unconscious": 40,
    "bleeding": 35,
    "medical": 30,
    "injured": 30,
    "fire": 30,
    "drowning": 30,
    "pregnant": 25,
    "child": 25,
    "elderly": 20,
    "food": 10,
    "water": 10,
    "shelter": 10,
}


def calculate_priority(description: str) -> int:
    """
    Calculate a priority score from an SOS description.

    Returns a score from 0 to 100.
    Higher score means more urgent.
    """

    if not description:
        return 0

    text = description.lower()
    score = 0

    for keyword, points in PRIORITY_RULES.items():
        if keyword in text:
            score += points

    return min(score, 100)


def priority_category(score: int) -> str:
    """Convert a numerical score into a readable priority level."""

    if score >= 70:
        return "CRITICAL"
    elif score >= 40:
        return "HIGH"
    elif score >= 20:
        return "MEDIUM"
    else:
        return "LOW"


def rank_requests(requests: list) -> list:
    """
    Score and rank SOS requests from highest to lowest priority.
    """

    for request in requests:
        description = request.get("description", "")

        score = calculate_priority(description)

        request["priority_score"] = score
        request["priority"] = priority_category(score)

    return sorted(
        requests,
        key=lambda request: request["priority_score"],
        reverse=True,
    )