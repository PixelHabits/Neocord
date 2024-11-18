"""Module for seeding and managing server data in the database."""

from sqlalchemy.sql import text

from app.models import SCHEMA, Server, ServerMember, User, db, environment


def seed_servers():
	"""Seed the database with servers."""
	demo = User.query.filter(User.username == 'Demo').first()
	marnie = User.query.filter(User.username == 'marnie').first()
	bobbie = User.query.filter(User.username == 'bobbie').first()

	# Create servers with their owners
	servers_data = [
		{
			'server': Server(
				name="Demo's Server",
				description="Demo's server for general discussions",
			),
			'owner': demo,
		},
		{
			'server': Server(
				name='the clubhouse', description='goonies never say die!'
			),
			'owner': demo,
		},
		{
			'server': Server(
				name="Marnie's Server", description="Marnie's server for gaming and fun"
			),
			'owner': marnie,
		},
		{
			'server': Server(
				name="Bobbie's Server",
				description="Bobbie's server for work and collaboration",
			),
			'owner': bobbie,
		},
	]

	# Add servers and create owner memberships
	for data in servers_data:
		server = data['server']
		owner = data['owner']

		# Add server first
		db.session.add(server)
		db.session.commit()

		# Create owner membership
		owner_membership = ServerMember(
			user_id=owner.id, server_id=server.id, is_owner=True
		)
		db.session.add(owner_membership)

	db.session.commit()


def undo_servers():
	"""Undo the seeding of servers."""
	if environment == 'production':
		db.session.execute(
			f'TRUNCATE TABLE {SCHEMA}.server_members RESTART IDENTITY CASCADE;'
		)
		db.session.execute(f'TRUNCATE TABLE {SCHEMA}.servers RESTART IDENTITY CASCADE;')
	else:
		db.session.execute(text('DELETE FROM server_members'))
		db.session.execute(text('DELETE FROM servers'))

	db.session.commit()
