"""Module for seeding and managing channel data in the database."""

from sqlalchemy.sql import text

from app.models import SCHEMA, Server, db, environment
from app.models.channel import Channel, ChannelVisibility


def generate_channels():
	"""Generate a list of channels."""
	return [
		{
			'name': 'announcements',
			'visibility': ChannelVisibility.PUBLIC,
		},
		{
			'name': 'introductions',
			'visibility': ChannelVisibility.PUBLIC,
		},
		{
			'name': 'random',
			'visibility': ChannelVisibility.PUBLIC,
		},
		{
			'name': 'help',
			'visibility': ChannelVisibility.PUBLIC,
		},
		{
			'name': 'resources',
			'visibility': ChannelVisibility.PUBLIC,
		},
		{
			'name': 'projects',
			'visibility': ChannelVisibility.PUBLIC,
		},
		{
			'name': 'events',
			'visibility': ChannelVisibility.PUBLIC,
		},
		{
			'name': 'moderators-only',
			'visibility': ChannelVisibility.PRIVATE,
		},
		{
			'name': 'admin-announcements',
			'visibility': ChannelVisibility.PRIVATE,
		},
	]


def seed_channels():
	"""Seed the database with channels."""
	# Get all servers
	servers = Server.query.all()
	channels_to_add = []
	channels_template = generate_channels()

	# Create channels for each server
	for server in servers:
		for channel_data in channels_template:
			channel = Channel(
				name=channel_data['name'],
				server_id=server.id,
				visibility=channel_data['visibility'],
			)
			channels_to_add.append(channel)

	# Add all channels to session and commit
	db.session.add_all(channels_to_add)
	db.session.commit()


def undo_channels():
	"""Undo the seeding of channels."""
	if environment == 'production':
		db.session.execute(
			f'TRUNCATE TABLE {SCHEMA}.channels RESTART IDENTITY CASCADE;'
		)
	else:
		db.session.execute(text('DELETE FROM channels'))

	db.session.commit()
