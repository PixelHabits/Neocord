from .db import SCHEMA, add_prefix_for_prod, db, environment


class ServerMember(db.Model):
    __tablename__ = "server_members"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id"), ondelete="CASCADE"),
        nullable=False,
    )
    server_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("servers.id"), ondelete="CASCADE"),
        nullable=False,
    )
    is_owner = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(
        db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
    )

    # Add a unique constraint for user_id and server_id combination
    __table_args__ = (
        db.UniqueConstraint("user_id", "server_id", name="unique_user_server"),
        *([{"schema": SCHEMA}] if environment == "production" else []),
    )

    # Relationships
    user = db.relationship("User", back_populates="server_members")
    server = db.relationship("Server", back_populates="server_members")

    def to_dict(self):
        user_dict = self.user.to_dict()
        user_dict["is_owner"] = self.is_owner
        return {
            "user": user_dict,
            "join_date": self.created_at,
        }
