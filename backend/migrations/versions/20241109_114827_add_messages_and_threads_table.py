"""Add Messages and Threads Table.

Revision ID: 84fe2c915d76
Revises: 2e1b14261b74
Create Date: 2024-11-09 11:48:27.174338

"""

import os

import sqlalchemy as sa
from alembic import op

environment = os.getenv('FLASK_ENV')
SCHEMA = os.environ.get('SCHEMA')

# revision identifiers, used by Alembic.
revision = '84fe2c915d76'
down_revision = '2e1b14261b74'
branch_labels = None
depends_on = None


def upgrade():
	"""Create the messages and threads tables."""
	# Create messages table
	op.create_table(
		'messages',
		sa.Column('id', sa.Integer(), nullable=False),
		sa.Column('body', sa.String(length=10000), nullable=False),
		sa.Column('user_id', sa.Integer(), nullable=False),
		sa.Column('channel_id', sa.Integer(), nullable=False),
		sa.Column('created_at', sa.DateTime(), nullable=False),
		sa.Column('updated_at', sa.DateTime(), nullable=False),
		sa.ForeignKeyConstraint(['channel_id'], ['channels.id'], ondelete='CASCADE'),
		sa.ForeignKeyConstraint(
			['user_id'],
			['users.id'],
		),
		sa.PrimaryKeyConstraint('id'),
	)

	# Create threads table
	op.create_table(
		'threads',
		sa.Column('id', sa.Integer(), nullable=False),
		sa.Column('channel_id', sa.Integer(), nullable=False),
		sa.Column('parent_message_id', sa.Integer(), nullable=False),
		sa.Column('created_at', sa.DateTime(), nullable=True),
		sa.Column('updated_at', sa.DateTime(), nullable=True),
		sa.ForeignKeyConstraint(['channel_id'], ['channels.id'], ondelete='CASCADE'),
		sa.ForeignKeyConstraint(
			['parent_message_id'], ['messages.id'], ondelete='CASCADE'
		),
		sa.PrimaryKeyConstraint('id'),
	)

	# Add thread_id column with CASCADE delete
	op.add_column('messages', sa.Column('thread_id', sa.Integer(), nullable=True))

	with op.batch_alter_table('messages') as batch_op:
		batch_op.create_foreign_key(
			'fk_messages_thread_id',
			'threads',
			['thread_id'],
			['id'],
			ondelete='CASCADE',
		)

	if environment == 'production':
		op.execute(f'ALTER TABLE messages SET SCHEMA {SCHEMA};')
		op.execute(f'ALTER TABLE threads SET SCHEMA {SCHEMA};')


def downgrade():
	"""Remove the messages and threads tables."""
	if environment == 'production':
		op.execute('ALTER TABLE messages SET SCHEMA public')
		op.execute('ALTER TABLE threads SET SCHEMA public')

	# Drop the foreign key constraint first
	with op.batch_alter_table('messages') as batch_op:
		batch_op.drop_constraint('fk_messages_thread_id', type_='foreignkey')
		batch_op.drop_column('thread_id')

	# Then drop the tables in reverse order
	op.drop_table('threads')
	op.drop_table('messages')
	# ### end Alembic commands ###
