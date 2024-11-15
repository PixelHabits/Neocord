from flask.cli import AppGroup

from app.models.db import environment

from .channels import seed_channels, undo_channels
from .messages import seed_messages, undo_messages
from .reactions import seed_reactions, undo_reactions
from .server_members import seed_server_members, undo_server_members
from .servers import seed_servers, undo_servers
from .users import seed_users, undo_users

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
	if environment == 'production':
		undo_reactions()
		undo_messages()
		undo_channels()
		undo_server_members()
		undo_servers()
		undo_users()

	seed_users()
	seed_servers()
	seed_channels()
	seed_server_members()
	seed_messages()
	seed_reactions()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
	undo_reactions()
	undo_messages()
	undo_channels()
	undo_server_members()
	undo_servers()
	undo_users()
