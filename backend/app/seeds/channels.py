from sqlalchemy.sql import text

from app.models import SCHEMA, Server, db, environment
from app.models.channel import Channel, ChannelVisibility


def seed_channels():
    demo_server = Server.query.filter(Server.name == "Demo's Server").first()
    marnie_server = Server.query.filter(Server.name == "Marnie's Server").first()
    bobbie_server = Server.query.filter(Server.name == "Bobbie's Server").first()

    demo_general_channel = Channel(
        name="general",
        server_id=demo_server.id,
        visibility=ChannelVisibility.PUBLIC,
    )

    marnie_general_channel = Channel(
        name="general",
        server_id=marnie_server.id,
        visibility=ChannelVisibility.PUBLIC,
    )

    bobbie_general_channel = Channel(
        name="general",
        server_id=bobbie_server.id,
        visibility=ChannelVisibility.PUBLIC,
    )

    db.session.add(demo_general_channel)
    db.session.add(marnie_general_channel)
    db.session.add(bobbie_general_channel)

    db.session.commit()


def undo_channels():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE TABLE {SCHEMA}.channels RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM channels"))

    db.session.commit()
