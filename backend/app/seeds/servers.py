from sqlalchemy.sql import text

from app.models import SCHEMA, Server, User, db, environment


def seed_servers():
    demo = User.query.filter(User.username == "Demo").first()
    marnie = User.query.filter(User.username == "marnie").first()
    bobbie = User.query.filter(User.username == "bobbie").first()

    demo_server = Server(
        name="Demo's Server",
        description="Demo's server for general discussions",
        owner_id=demo.id,
    )

    marnie_server = Server(
        name="Marnie's Server",
        description="Marnie's server for gaming and fun",
        owner_id=marnie.id,
    )

    bobbie_server = Server(
        name="Bobbie's Server",
        description="Bobbie's server for work and collaboration",
        owner_id=bobbie.id,
    )

    db.session.add(demo_server)
    db.session.add(marnie_server)
    db.session.add(bobbie_server)

    db.session.commit()


def undo_servers():
    if environment == "production":
        db.session.execute(f"TRUNCATE TABLE {SCHEMA}.servers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM servers"))

    db.session.commit()
