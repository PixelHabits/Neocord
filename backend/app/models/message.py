from .db import SCHEMA, add_prefix_for_prod, db, environment


class Message(db.Model):
    __tablename__ = "messages"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(255), nullable=False)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    channel_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("channels.id")), nullable=False
    )
    thread_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("threads.id")), nullable=True
    )
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(
        db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
    )
    # Relationships
    user = db.relationship("User", back_populates="messages")
    channel = db.relationship("Channel", back_populates="messages")
    thread = db.relationship(
        "Thread",
        back_populates="thread_messages",
        foreign_keys=[thread_id],
        primaryjoin="Message.thread_id == Thread.id",
    )
