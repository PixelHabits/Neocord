"""create message and threads

Revision ID: 26247b437e20
Revises: 2e1b14261b74
Create Date: 2024-11-08 12:29:27.830607

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "26247b437e20"
down_revision = "2e1b14261b74"
branch_labels = None
depends_on = None


def upgrade():
    # Create messages table first without thread_id
    op.create_table(
        "messages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("body", sa.String(length=255), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("channel_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["channel_id"],
            ["channels.id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create threads table
    op.create_table(
        "threads",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("channel_id", sa.Integer(), nullable=False),
        sa.Column("message_id", sa.Integer(), nullable=False),
        sa.Column("start_message_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["channel_id"],
            ["channels.id"],
        ),
        sa.ForeignKeyConstraint(
            ["message_id"],
            ["messages.id"],
        ),
        sa.ForeignKeyConstraint(
            ["start_message_id"],
            ["messages.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Add thread_id to messages after threads table exists
    op.add_column("messages", sa.Column("thread_id", sa.Integer(), nullable=True))
    op.create_foreign_key(None, "messages", "threads", ["thread_id"], ["id"])


def downgrade():
    # Remove thread_id foreign key and column first
    op.drop_constraint(None, "messages", type_="foreignkey")
    op.drop_column("messages", "thread_id")

    # Then drop tables in reverse order
    op.drop_table("threads")
    op.drop_table("messages")
