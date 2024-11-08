from flask.cli import AppGroup

from app.models.db import SCHEMA, db, environment

from .channels import seed_channels, undo_channels
from .servers import seed_servers, undo_servers
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
    seed_users()
    seed_servers()
    seed_channels()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_users()
    undo_servers()
    undo_channels()
    # Add other undo functions here
