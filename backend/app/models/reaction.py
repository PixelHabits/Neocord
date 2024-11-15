"""Module for the Reaction model."""

from .db import SCHEMA, add_prefix_for_prod, db, environment


class Reaction(db.Model):
	"""Reaction model."""

	__tablename__ = 'reactions'

	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(
		db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False
	)
	message_id = db.Column(
		db.Integer, db.ForeignKey(add_prefix_for_prod('messages.id')), nullable=False
	)
	emoji = db.Column(db.String, nullable=False)
	created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
	updated_at = db.Column(
		db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
	)

	__table_args__ = (
		db.Index('idx_message_user', message_id, user_id),
		*([{'schema': SCHEMA}] if environment == 'production' else []),
	)

	# Relationships
	user = db.relationship('User', back_populates='reactions')
	message = db.relationship('Message', back_populates='reactions')

	def to_dict(self):
		"""Convert the reaction to a dictionary."""
		return {
			'id': self.id,
			'user_id': self.user_id,
			'message_id': self.message_id,
			'emoji': self.emoji,
		}
