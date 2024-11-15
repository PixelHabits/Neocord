"""Module for the Message model."""

from .db import SCHEMA, add_prefix_for_prod, db, environment


class Message(db.Model):
	"""Message model."""

	__tablename__ = 'messages'

	if environment == 'production':
		__table_args__ = {'schema': SCHEMA}

	id = db.Column(db.Integer, primary_key=True)
	body = db.Column(db.String(10000), nullable=False)
	user_id = db.Column(
		db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False
	)
	channel_id = db.Column(
		db.Integer,
		db.ForeignKey(add_prefix_for_prod('channels.id'), ondelete='CASCADE'),
		nullable=False,
	)
	thread_id = db.Column(
		db.Integer,
		db.ForeignKey(
			add_prefix_for_prod('threads.id'),
			ondelete='CASCADE',
		),
		nullable=True,
	)
	created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
	updated_at = db.Column(
		db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
	)

	# Relationships
	user = db.relationship('User', back_populates='messages')
	channel = db.relationship(
		'Channel',
		back_populates='messages',
		cascade='all, delete',
		passive_deletes=True,
	)
	reactions = db.relationship(
		'Reaction',
		back_populates='message',
		cascade='all, delete-orphan',
		lazy='selectin',
	)
	thread = db.relationship(
		'Thread',
		foreign_keys=[thread_id],
		back_populates='replies',
		passive_deletes=True,
	)
	parent_thread = db.relationship(
		'Thread',
		back_populates='parent_message',
		foreign_keys='Thread.parent_message_id',
		cascade='all, delete-orphan',
		passive_deletes=True,
		single_parent=True,
		uselist=False,
	)

	def to_dict(self, include_replies=True):
		"""Return message data with thread info if it exists."""
		message_dict = {
			'id': self.id,
			'body': self.body,
			'userId': self.user_id,
			'channelId': self.channel_id,
			'createdAt': self.created_at,
			'updatedAt': self.updated_at,
			'thread': None,
			'replyCount': 0,
			'reactions': [reaction.to_dict() for reaction in self.reactions],
		}

		if include_replies and self.parent_thread:
			message_dict['thread'] = {
				'id': self.parent_thread.id,
				'replies': [
					reply.to_dict(include_replies=False)
					for reply in self.parent_thread.replies
				],
				'createdAt': self.parent_thread.created_at,
			}
			message_dict['replyCount'] = len(self.parent_thread.replies)
		# If this is a reply, include thread info only if specifically needed
		# elif self.thread:
		#     message_dict["thread"] = {
		#         "id": self.thread.id,
		#         "replyCount": len(self.thread.replies),
		#         "latest_replies": [
		#             reply.to_dict(include_replies=False)
		#             for reply in self.thread.replies[-3:]
		#         ],
		#         "createdAt": self.thread.created_at,
		#     }

		return message_dict
