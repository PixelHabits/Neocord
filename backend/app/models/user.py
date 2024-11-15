from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from .db import SCHEMA, db, environment


class User(db.Model, UserMixin):
	__tablename__ = 'users'

	if environment == 'production':
		__table_args__ = {'schema': SCHEMA}

	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(40), nullable=False, unique=True)
	email = db.Column(db.String(255), nullable=False, unique=True)
	hashed_password = db.Column(db.String(255), nullable=False)
	created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
	updated_at = db.Column(
		db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now()
	)

	servers = db.relationship(
		'Server', secondary='server_members', back_populates='members', viewonly=True
	)
	messages = db.relationship(
		'Message', back_populates='user', cascade='all, delete-orphan'
	)
	reactions = db.relationship(
		'Reaction', back_populates='user', cascade='all, delete-orphan'
	)
	server_members = db.relationship(
		'ServerMember', back_populates='user', cascade='all, delete-orphan'
	)

	@property
	def password(self):
		return self.hashed_password

	@password.setter
	def password(self, password):
		self.hashed_password = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.password, password)

	def to_dict(self):
		return {'id': self.id, 'username': self.username, 'email': self.email}
