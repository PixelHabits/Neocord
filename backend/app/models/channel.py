import enum

from sqlalchemy import func

from .db import SCHEMA, add_prefix_for_prod, db, environment
from .message import Message
from .thread import Thread


class ChannelVisibility(enum.Enum):
	PUBLIC = 'public'
	PRIVATE = 'private'


class Channel(db.Model):
	__tablename__ = 'channels'

	if environment == 'production':
		__table_args__ = {'schema': SCHEMA}

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), nullable=False)
	server_id = db.Column(
		db.Integer,
		db.ForeignKey(add_prefix_for_prod('servers.id'), ondelete='CASCADE'),
		nullable=False,
	)
	visibility = db.Column(
		db.Enum(ChannelVisibility), nullable=False, default=ChannelVisibility.PUBLIC
	)
	created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
	updated_at = db.Column(
		db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
	)
	# Relationships
	server = db.relationship('Server', back_populates='channels')
	messages = db.relationship(
		'Message',
		back_populates='channel',
		cascade='all, delete-orphan',
		passive_deletes=True,
		lazy='selectin',
	)
	threads = db.relationship(
		'Thread',
		back_populates='channel',
		cascade='all, delete-orphan',
		passive_deletes=True,
		lazy='selectin',
		primaryjoin='Channel.id==Thread.channel_id',
	)

	def to_dict(self):
		return {
			'id': self.id,
			'name': self.name,
			'server_id': self.server_id,
			'visibility': self.visibility.value,
		}

	def get_messages_with_threads(self):
		"""Get channel messages with their thread info organized"""
		from sqlalchemy.orm import joinedload

		# Get all channel messages that aren't replies (thread_id is None)
		messages = (
			Message.query.filter(
				Message.channel_id == self.id, Message.thread_id.is_(None)
			)
			.join(Message.thread, isouter=True)  # Left join with thread
			.join(Thread.replies, isouter=True)  # Left join with replies
			.options(joinedload(Message.thread).joinedload(Thread.replies))
			# Order by the latest activity (either message creation or latest reply)
			.order_by(func.coalesce(func.max(Message.created_at), Message.created_at))
			.group_by(Message.id)
			.all()
		)

		return [message.to_dict_with_thread() for message in messages]
