from .db import SCHEMA, add_prefix_for_prod, db, environment


class ServerMember(db.Model):
    __tablename__ = "server_members"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    server_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("servers.id")), nullable=False
    )

    # Relationships
    user = db.relationship("User", back_populates="server_members")
    server = db.relationship("Server", back_populates="server_members")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "server_id": self.server_id,
        }
