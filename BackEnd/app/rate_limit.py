"""
WHAT THIS FILE DOES (plain English):
This file stops one person (or one script) from flooding us with fake SOS
requests. It counts how many requests each visitor sends and, past a set
number per hour, replies "too many requests" instead of saving another row.

Beginner note: this is called "rate limiting" -- like a ticket counter that
serves each person a few times an hour so nobody can hog the queue.

A DELIBERATE DESIGN CHOICE, worth understanding before tuning the numbers:
in a disaster app, wrongly blocking a real victim is far worse than storing
a fake request. During a flood or earthquake an entire relief camp can sit
behind a single shared internet connection, which means they all look like
ONE visitor to the counting below. So the limit here is set generously -- it
exists to stop automated floods, not to police individual people. If you
ever find yourself lowering it to "catch more spam", you are also making it
likelier that the twelfth person in a shelter cannot ask for help.
"""

import os

from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request

# How many SOS submissions one visitor may make per hour. Overridable via
# .env so it can be tightened in a demo or loosened during a real event
# without editing code.
SOS_RATE_LIMIT = os.getenv("SOS_RATE_LIMIT", "10/hour")


def client_identifier(request: Request) -> str:
    """
    Works out "who" a request came from, for counting purposes.

    On Railway (and most hosting) our app sits behind a proxy, so the
    connecting address is the PROXY's address -- identical for every user on
    the planet. Left alone, that would make the whole world share one limit
    and lock everyone out after ten requests. The proxy records the original
    visitor in the X-Forwarded-For header, so we read the first entry there.

    Caveat: a client can invent that header when talking to us directly, so
    this is not a security control -- someone determined can rotate it and
    get around the limit. It raises the cost of casual spam, which is what
    it is for. Real abuse prevention needs the phone-verification and
    credibility-scoring work that is still ahead of us.
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # "client, proxy1, proxy2" -- the original caller is leftmost.
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)


limiter = Limiter(key_func=client_identifier)
