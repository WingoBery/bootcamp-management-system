"""create registrations table

Revision ID: c3d4e5f6a7b8
Revises:
Create Date: 2026-06-29 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c3d4e5f6a7b8"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "registrations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("bootcamp_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("registered_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("student_id", "bootcamp_id", name="uq_student_bootcamp"),
    )
    op.create_index(op.f("ix_registrations_bootcamp_id"), "registrations", ["bootcamp_id"], unique=False)
    op.create_index(op.f("ix_registrations_id"), "registrations", ["id"], unique=False)
    op.create_index(op.f("ix_registrations_student_id"), "registrations", ["student_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_registrations_student_id"), table_name="registrations")
    op.drop_index(op.f("ix_registrations_id"), table_name="registrations")
    op.drop_index(op.f("ix_registrations_bootcamp_id"), table_name="registrations")
    op.drop_table("registrations")
