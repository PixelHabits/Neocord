from .db import SCHEMA, add_prefix_for_prod, db, environment
from .message import Message


class Thread(db.Model):
    __tablename__ = "threads"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("channels.id")), nullable=False
    )
    message_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("messages.id")), nullable=False
    )
    start_message_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("messages.id")), nullable=False
    )
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updated_at = db.Column(
        db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
    )

    # Relationships
    channel = db.relationship("Channel", back_populates="threads")
    thread_messages = db.relationship(
        "Message",
        back_populates="thread",
        foreign_keys=[Message.thread_id],
        primaryjoin="Message.thread_id == Thread.id",
    )
    start_message = db.relationship(
        "Message",
        foreign_keys=[start_message_id],
        primaryjoin="Thread.start_message_id == Message.id",
        uselist=False,
    )
    parent_message = db.relationship(
        "Message",
        foreign_keys=[message_id],
        primaryjoin="Thread.message_id == Message.id",
        uselist=False,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "channel_id": self.channel_id,
            "message_id": self.message_id,
            "start_message_id": self.start_message_id,
        }
