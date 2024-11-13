from random import choice, sample

from sqlalchemy.sql import text

from app.models import SCHEMA, Message, Reaction, User, db, environment


def generate_reactions():
    return [
        "👋",
        "❤️",
        "🎉",
        "👍",
        "🔥",
        "😊",
        "🚀",
        "💯",
        "✨",
        "🙌",
        "😂",
        "💪",
        "🎮",
        "💻",
        "📚",
        "🤔",
        "👀",
        "💡",
        "🌟",
        "🙏",
    ]


def seed_reactions():
    try:
        demo = User.query.filter(User.username == "Demo").first()
        marnie = User.query.filter(User.username == "marnie").first()
        bobbie = User.query.filter(User.username == "bobbie").first()

        if not all([demo, marnie, bobbie]):
            print("Error: Could not find all required users")
            return

        users = [demo, marnie, bobbie]
        messages = Message.query.all()

        if not messages:
            print("Error: No messages found to add reactions to")
            return

        messages_to_react = sample(messages, min(len(messages), 15))
        reactions = []

        for message in messages_to_react:
            reacting_users = sample(users, choice(range(1, 4)))
            for user in reacting_users:
                reaction = Reaction(
                    user_id=user.id,
                    message_id=message.id,
                    emoji=choice(generate_reactions()),
                )
                reactions.append(reaction)

        db.session.add_all(reactions)
        db.session.commit()
        print(f"Successfully added {len(reactions)} reactions!")

    except Exception as e:
        db.session.rollback()
        print(f"Error seeding reactions: {str(e)}")


def undo_reactions():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM reactions"))

    db.session.commit()
