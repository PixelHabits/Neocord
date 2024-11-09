from .db import SCHEMA, add_prefix_for_prod, db, environment


class Thread(db.Model):
    __tablename__ = "threads"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("channels.id"), name="fk_thread_channel"),
        nullable=False,
    )
    message_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("messages.id"), name="fk_thread_message"),
        nullable=True,
    )
    start_message_id = db.Column(
        db.Integer,
        db.ForeignKey(
            add_prefix_for_prod("messages.id"), name="fk_thread_start_message"
        ),
        nullable=True,
    )
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    # Relationships
    channel = db.relationship("Channel", back_populates="threads")
    message = db.relationship("Message", foreign_keys=[message_id])
    start_message = db.relationship("Message", foreign_keys=[start_message_id])
