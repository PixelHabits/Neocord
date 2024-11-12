from sqlalchemy.sql import text

from app.models import SCHEMA, Server, ServerMember, User, db, environment


def seed_server_members():
    demo = User.query.filter(User.username == "Demo").first()
    marnie = User.query.filter(User.username == "marnie").first()
    bobbie = User.query.filter(User.username == "bobbie").first()

    demo_server = Server.query.filter(Server.name == "Demo's Server").first()
    marnie_server = Server.query.filter(Server.name == "Marnie's Server").first()
    bobbie_server = Server.query.filter(Server.name == "Bobbie's Server").first()

    server_members = [
        # Demo is a member of all servers (already owner of their own)
        ServerMember(user_id=demo.id, server_id=marnie_server.id, is_owner=False),
        ServerMember(user_id=demo.id, server_id=bobbie_server.id, is_owner=False),
        # Marnie is a member of Demo's and Bobbie's servers
        ServerMember(user_id=marnie.id, server_id=demo_server.id, is_owner=False),
        ServerMember(user_id=marnie.id, server_id=bobbie_server.id, is_owner=False),
        # Bobbie is a member of Demo's and Marnie's servers
        ServerMember(user_id=bobbie.id, server_id=demo_server.id, is_owner=False),
        ServerMember(user_id=bobbie.id, server_id=marnie_server.id, is_owner=False),
    ]

    db.session.add_all(server_members)
    db.session.commit()


def undo_server_members():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.server_members RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM server_members"))

    db.session.commit()
