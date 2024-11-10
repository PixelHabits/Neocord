from sqlalchemy.sql import text

from app.models import SCHEMA, Message, Reaction, User, db, environment


def seed_reactions():
    demo = User.query.filter(User.username == "Demo").first()
    marnie = User.query.filter(User.username == "marnie").first()
    bobbie = User.query.filter(User.username == "bobbie").first()

    messages = Message.query.limit(3).all()

    reactions = [
        Reaction(user_id=demo.id, message_id=messages[0].id, emoji="👋"),
        Reaction(user_id=marnie.id, message_id=messages[1].id, emoji="❤️"),
        Reaction(user_id=bobbie.id, message_id=messages[2].id, emoji="🎉"),
    ]

    for reaction in reactions:
        db.session.add(reaction)

    db.session.commit()


def undo_reactions():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM reactions"))

    db.session.commit()
