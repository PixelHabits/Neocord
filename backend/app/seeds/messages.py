from sqlalchemy.sql import text

from app.models import SCHEMA, Channel, Message, User, db, environment


def seed_messages():
    demo = User.query.filter(User.username == "Demo").first()
    marnie = User.query.filter(User.username == "marnie").first()
    bobbie = User.query.filter(User.username == "bobbie").first()

    channels = Channel.query.limit(3).all()

    messages = [
        Message(
            body="Hey everyone! Welcome to the channel!",
            user_id=demo.id,
            channel_id=channels[0].id,
        ),
        Message(
            body="Thanks for having us here!",
            user_id=marnie.id,
            channel_id=channels[0].id,
        ),
        Message(
            body="Let's get this conversation started!",
            user_id=bobbie.id,
            channel_id=channels[1].id,
        ),
    ]

    for message in messages:
        db.session.add(message)

    db.session.commit()


def undo_messages():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE TABLE {SCHEMA}.messages RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM messages"))

    db.session.commit()
