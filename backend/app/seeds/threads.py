from sqlalchemy.sql import text

from app.models import SCHEMA, db, environment
from app.models.message import Message
from app.models.thread import Thread


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
            parent_message_id=first_message.id,
        ),
        Thread(
            channel_id=first_message.channel_id,
            parent_message_id=second_message.id,
        ),
    ]

    # Add threads first so we have their IDs
    for thread in threads:
        db.session.add(thread)
    db.session.commit()

    # Create replies for the first thread
    thread_replies = [
        Message(
            body="This is a reply to the welcome message!",
            user_id=first_message.user_id,  # Using same user for example
            channel_id=first_message.channel_id,
            thread_id=threads[0].id,  # Reference to the first thread
        ),
        Message(
            body="Thanks for starting this thread!",
            user_id=second_message.user_id,  # Using second message's user
            channel_id=first_message.channel_id,
            thread_id=threads[0].id,
        ),
    ]

    for reply in thread_replies:
        db.session.add(reply)

    db.session.commit()


def undo_threads():
    if environment == "production":
        db.session.execute(f"TRUNCATE TABLE {SCHEMA}.thread RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM threads"))

    db.session.commit()
