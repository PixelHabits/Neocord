from .db import SCHEMA, add_prefix_for_prod, db, environment


class Message(db.Model):
    __tablename__ = "messages"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(10000), nullable=False)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    channel_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("channels.id")), nullable=False
    )
    thread_id = db.Column(
        db.Integer,
        db.ForeignKey(
            add_prefix_for_prod("threads.id"),
            ondelete="CASCADE",
        ),
        nullable=True,
    )
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(
        db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
    )

    # Relationships
    user = db.relationship("User", back_populates="messages")
    channel = db.relationship("Channel", back_populates="messages")
    reactions = db.relationship(
        "Reaction",
        back_populates="message",
        cascade="all, delete-orphan",
        lazy="joined",
    )
    thread = db.relationship(
        "Thread",
        foreign_keys=[thread_id],
        back_populates="replies",
        passive_deletes=True,
    )

    def to_dict(self):
        """Return message data with thread info if it exists"""
        message_dict = {
            "id": self.id,
            "body": self.body,
            "user_id": self.user_id,
            "channel_id": self.channel_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "thread": None,
            "reply_count": 0,
            "reactions": [reaction.to_dict() for reaction in self.reactions],
        }

        if hasattr(self, "thread") and self.thread is not None:
            message_dict["thread"] = {
                "id": self.thread.id,
                "reply_count": len(self.thread.replies),
                "latest_replies": [
                    reply.to_dict()
                    for reply in self.thread.replies[-3:]  # Last 3 replies
                ],
                "created_at": self.thread.created_at,
            }

        return message_dict
