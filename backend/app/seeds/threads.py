from sqlalchemy.sql import text

from app.models import SCHEMA, db, environment
from app.models.message import Message
from app.models.threads import Thread


def seed_threads():
    # Get specific messages to attach threads to
    first_message = Message.query.filter(
        Message.body == "Hey everyone! Welcome to the channel!"
    ).first()

    second_message = Message.query.filter(
        Message.body == "Thanks for having us here!"
    ).first()

    threads = [
        Thread(
            channel_id=first_message.channel_id,
            start_message_id=first_message.id,
        ),
        Thread(
            channel_id=first_message.channel_id,
            message_id=second_message.id,
        ),
    ]

    for thread in threads:
        db.session.add(thread)

    db.session.commit()


def undo_threads():
    if environment == "production":
        db.session.execute(f"TRUNCATE TABLE {SCHEMA}.threads RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM threads"))

    db.session.commit()
