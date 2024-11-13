from sqlalchemy.sql import text

from app.models import SCHEMA, db, environment
from app.models.message import Message
from app.models.thread import Thread


def seed_threads():
    # Threads are created in messages.py
    pass


def undo_threads():
    # Threads will be removed when messages are removed due to CASCADE
    pass
