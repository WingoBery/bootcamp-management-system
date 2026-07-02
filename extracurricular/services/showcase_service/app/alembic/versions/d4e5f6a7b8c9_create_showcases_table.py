"""create showcases table

Revision ID: d4e5f6a7b8c9
Revises:
Create Date: 2026-06-29 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d4e5f6a7b8c9"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "showcases",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("bootcamp_id", sa.Integer(), nullable=False),
        sa.Column("supervisor_id", sa.Integer(), nullable=True),
        sa.Column("project_title", sa.String(), nullable=False),
        sa.Column("project_url", sa.String(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("marks", sa.Float(), nullable=True),
        sa.Column("evaluation", sa.String(), nullable=True),
        sa.Column("feedback", sa.Text(), nullable=True),
        sa.Column("submitted_at", sa.DateTime(), nullable=True),
        sa.Column("graded_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_showcases_bootcamp_id"), "showcases", ["bootcamp_id"], unique=False)
    op.create_index(op.f("ix_showcases_id"), "showcases", ["id"], unique=False)
    op.create_index(op.f("ix_showcases_student_id"), "showcases", ["student_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_showcases_student_id"), table_name="showcases")
    op.drop_index(op.f("ix_showcases_id"), table_name="showcases")
    op.drop_index(op.f("ix_showcases_bootcamp_id"), table_name="showcases")
    op.drop_table("showcases")
