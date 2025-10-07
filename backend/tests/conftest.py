# backend/tests/conftest.py
import sys
import os
from pathlib import Path

# add the backend root directory (one level up from tests/) to sys.path
ROOT = str(Path(__file__).resolve().parents[1])
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
