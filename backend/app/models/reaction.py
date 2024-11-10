from .db import SCHEMA, add_prefix_for_prod, db, environment


class Reaction(db.Model):
    __tablename__ = "reactions"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    message_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("messages.id")), nullable=False
    )
    emoji = db.Column(db.String, nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="reactions")
    message = db.relationship("Message", back_populates="reactions")
