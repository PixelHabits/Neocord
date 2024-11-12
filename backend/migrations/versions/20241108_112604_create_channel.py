"""create channel

Revision ID: 2e1b14261b74
Revises: f20fa35fc3d9
Create Date: 2024-11-08 11:26:04.821670

"""

import os

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "2e1b14261b74"
down_revision = "f20fa35fc3d9"
branch_labels = None
depends_on = None

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "channels",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("server_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column(
            "visibility",
            sa.Enum("PUBLIC", "PRIVATE", name="channelvisibility"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["server_id"],
            ["servers.id"],
            ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    if environment == "production":
        op.execute(f"ALTER TABLE channels SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("channels")
    # ### end Alembic commands ###
