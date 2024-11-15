from .db import SCHEMA, add_prefix_for_prod, db, environment


class Thread(db.Model):
	__tablename__ = 'threads'

	if environment == 'production':
		__table_args__ = {'schema': SCHEMA}

	id = db.Column(db.Integer, primary_key=True)
	channel_id = db.Column(
		db.Integer,
		db.ForeignKey(add_prefix_for_prod('channels.id'), ondelete='CASCADE'),
		nullable=False,
	)
	parent_message_id = db.Column(
		db.Integer,
		db.ForeignKey(add_prefix_for_prod('messages.id'), ondelete='CASCADE'),
		nullable=False,
	)
	created_at = db.Column(db.DateTime, default=db.func.now())
	updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

	# Relationships
	channel = db.relationship('Channel', back_populates='threads', passive_deletes=True)
	parent_message = db.relationship(
		'Message',
		foreign_keys=[parent_message_id],
		back_populates='parent_thread',
		passive_deletes=True,
		single_parent=True,
	)
	replies = db.relationship(
		'Message',
		back_populates='thread',
		foreign_keys='Message.thread_id',
		cascade='all, delete',
		passive_deletes=True,
		lazy='selectin',
		primaryjoin='Message.thread_id==Thread.id',
	)
