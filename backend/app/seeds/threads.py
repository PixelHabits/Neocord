from sqlalchemy.sql import text

from app.models import SCHEMA, Channel, Message, Thread, db, environment


def seed_threads():
    # Get the first message to create a thread from
    first_message = Message.query.first()
    if not first_message:
        return  # Exit if no messages exist

    channel = Channel.query.first()
    if not channel:
        return  # Exit if no channels exist

    thread = Thread(
        channel_id=channel.id,
        message_id=first_message.id,
        start_message_id=first_message.id,
    )

    db.session.add(thread)
    db.session.commit()

    # Add a reply message to the thread
    thread_message = Message(
        body="This is a reply in the thread!",
        user_id=first_message.user_id,
        channel_id=channel.id,
        thread_id=thread.id,
    )

    db.session.add(thread_message)
    db.session.commit()


def undo_threads():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.threads RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM threads"))

    db.session.commit()
