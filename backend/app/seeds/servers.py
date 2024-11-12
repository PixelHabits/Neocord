from sqlalchemy.sql import text

from app.models import SCHEMA, Server, ServerMember, User, db, environment


def seed_servers():
    demo = User.query.filter(User.username == "Demo").first()
    marnie = User.query.filter(User.username == "marnie").first()
    bobbie = User.query.filter(User.username == "bobbie").first()

    demo_server = Server(
        name="Demo's Server",
        description="Demo's server for general discussions",
        server_members=[ServerMember(user_id=demo.id, is_owner=True)],
    )

    marnie_server = Server(
        name="Marnie's Server",
        description="Marnie's server for gaming and fun",
        server_members=[ServerMember(user_id=marnie.id, is_owner=True)],
    )

    bobbie_server = Server(
        name="Bobbie's Server",
        description="Bobbie's server for work and collaboration",
        server_members=[ServerMember(user_id=bobbie.id, is_owner=True)],
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
