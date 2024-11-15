from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlite3 import Connection as SQLite3Connection
import os

environment = os.getenv('FLASK_ENV')
SCHEMA = os.environ.get('SCHEMA')

db = SQLAlchemy()


@event.listens_for(Engine, 'connect')
def _set_sqlite_pragma(dbapi_connection, connection_record):
	if isinstance(dbapi_connection, SQLite3Connection):
		cursor = dbapi_connection.cursor()
		cursor.execute('PRAGMA foreign_keys=ON')
		cursor.close()


# helper function for adding prefix to foreign key column references in production
def add_prefix_for_prod(attr):
	if environment == 'production':
		return f'{SCHEMA}.{attr}'
	else:
		return attr
