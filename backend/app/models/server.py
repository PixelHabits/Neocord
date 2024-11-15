from .db import SCHEMA, db, environment


class Server(db.Model):
	__tablename__ = 'servers'

	if environment == 'production':
		__table_args__ = {'schema': SCHEMA}

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), nullable=False)
	description = db.Column(db.String(255))
	created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
	updated_at = db.Column(
		db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
	)

	# Relationships
	members = db.relationship(
		'User', secondary='server_members', back_populates='servers', viewonly=True
	)
	server_members = db.relationship(
		'ServerMember',
		back_populates='server',
		cascade='all, delete-orphan',
		lazy='joined',
	)
	channels = db.relationship(
		'Channel', back_populates='server', cascade='all, delete-orphan', lazy='joined'
	)

	@classmethod
	def get_by_id(cls, server_id, load_channels=True):
		"""
		Get server by ID with optional relationship loading

		Args:
		    server_id: The ID of the server to fetch
		    load_channels: Whether to eagerly load channels (default: True)
		"""
		query = cls.query
		if load_channels:
			query = query.options(db.joinedload(cls.channels))
		return query.get(server_id)

	def to_dict(self):
		"""Convert server to dictionary including all relationships"""
		return {
			'id': self.id,
			'name': self.name,
			'description': self.description,
			'members': [member.to_dict() for member in self.server_members],
			'owner': next(
				member.user.to_dict()
				for member in self.server_members
				if member.is_owner
			),
			'channels': [channel.to_dict() for channel in self.channels],
			'created_at': self.created_at,
			'updated_at': self.updated_at,
		}

	def to_dict_basic(self):
		"""Lightweight dictionary conversion with no relationships"""
		return {
			'id': self.id,
			'name': self.name,
			'description': self.description,
			'created_at': self.created_at,
			'updated_at': self.updated_at,
		}
