from flask.cli import AppGroup

from app.models.db import SCHEMA, db, environment

from .channels import seed_channels, undo_channels
from .messages import seed_messages, undo_messages
from .reactions import seed_reactions, undo_reactions
from .server_members import seed_server_members, undo_server_members
from .servers import seed_servers, undo_servers
from .threads import seed_threads, undo_threads
from .users import seed_users, undo_users

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup("seed")


# Creates the `flask seed all` command
@seed_commands.command("all")
def seed():
    if environment == "production":
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_servers()
        undo_channels()
        undo_messages()
        undo_threads()
        undo_reactions()
        undo_server_members()

    seed_users()
    seed_servers()
    seed_channels()
    seed_messages()
    seed_threads()
    seed_reactions()
    seed_server_members()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_users()
    undo_servers()
    undo_channels()
    undo_messages()
    undo_threads()
    undo_reactions()
    undo_server_members()
    # Add other undo functions here
