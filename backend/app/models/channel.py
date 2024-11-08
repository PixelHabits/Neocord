import enum

from .db import SCHEMA, add_prefix_for_prod, db, environment


class ChannelVisibility(enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"


class Channel(db.Model):
    __tablename__ = "channels"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    server_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("servers.id")), nullable=False
    )
    visibility = db.Column(
        db.Enum(ChannelVisibility), nullable=False, default=ChannelVisibility.PUBLIC
    )

    # Relationships
    server = db.relationship("Server", back_populates="channels")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "server_id": self.server_id,
            "visibility": self.visibility.value,
        }
