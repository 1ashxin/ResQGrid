"""
WHAT THIS FILE DOES (plain English):
This file marks the 'app' folder as a Python "package" so its files can be
imported using dotted paths like `app.main`.

It also makes the repo root importable, since core_security_and_logic/
(Member 5's priority engine and security work) lives one level above
BackEnd/, not inside it. This runs before any submodule of `app` is
loaded, regardless of entry point (uvicorn, tests, scripts), so
`import core_security_and_logic...` works anywhere in the app.
"""

import sys
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))
