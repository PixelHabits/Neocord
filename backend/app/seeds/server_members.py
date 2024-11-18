"""Module for seeding and managing server membership data in the database."""

from sqlalchemy.sql import text

from app.models import SCHEMA, Server, ServerMember, User, db, environment


def seed_server_members():
	"""Seed the database with server memberships."""
	# Get users
	demo = User.query.filter(User.username == 'Demo').first()
	marnie = User.query.filter(User.username == 'marnie').first()
	bobbie = User.query.filter(User.username == 'bobbie').first()

	# Get servers
	demo_server = Server.query.filter(Server.name == "Demo's Server").first()
	clubhouse = Server.query.filter(Server.name == 'the clubhouse').first()
	marnie_server = Server.query.filter(Server.name == "Marnie's Server").first()
	bobbie_server = Server.query.filter(Server.name == "Bobbie's Server").first()

	# Define non-owner memberships
	member_data = [
		# The clubhouse members (Demo already owner)
		{'user': marnie, 'server': clubhouse},
		{'user': bobbie, 'server': clubhouse},
		# Demo's server members (Demo already owner)
		{'user': marnie, 'server': demo_server},
		{'user': bobbie, 'server': demo_server},
		# Marnie's server members (Marnie already owner)
		{'user': demo, 'server': marnie_server},
		{'user': bobbie, 'server': marnie_server},
		# Bobbie's server members (Bobbie already owner)
		{'user': demo, 'server': bobbie_server},
		{'user': marnie, 'server': bobbie_server},
	]

	# Create non-owner memberships
	for data in member_data:
		member = ServerMember(
			user_id=data['user'].id, server_id=data['server'].id, is_owner=False
		)
		db.session.add(member)

	db.session.commit()


def undo_server_members():
	"""Undo the seeding of server memberships."""
	if environment == 'production':
		db.session.execute(
			f'TRUNCATE table {SCHEMA}.server_members RESTART IDENTITY CASCADE;'
		)
	else:
		db.session.execute(text('DELETE FROM server_members'))

	db.session.commit()
