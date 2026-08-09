"""
WHAT THIS FILE DOES (plain English):
This file marks the 'app' folder as a Python "package" so its files can be
imported using dotted paths like `app.main`.

core_security_and_logic/ (Member 5's priority engine and security work)
now lives inside BackEnd/, alongside this app/ folder, so it deploys
correctly on hosts like Railway that only build the BackEnd/ directory
(a repo-root sibling folder is invisible to those builds). This still
adds the BackEnd/ folder itself to sys.path as a safety net, so
`import core_security_and_logic...` keeps working no matter what the
process's working directory or entry point is (uvicorn, tests, scripts).
"""

import sys
from pathlib import Path

_BACKEND_ROOT = Path(__file__).resolve().parent.parent
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))
