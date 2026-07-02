"""create activities table

Revision ID: 594206afedcc
Revises: 
Create Date: 2026-03-16 15:23:16.334494

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '594206afedcc'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('extra_curricular-activities',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('category', sa.String(), nullable=True),
    sa.Column('organizer', sa.String(), nullable=True),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('start_time', sa.DateTime(), nullable=True),
    sa.Column('end_time', sa.DateTime(), nullable=True),
    sa.Column('registration_deadline', sa.DateTime(), nullable=False),
    sa.Column('max_participants', sa.Integer(), nullable=True),
    sa.Column('current_participants', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_extra_curricular-activities_id'), 'extra_curricular-activities', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_extra_curricular-activities_id'), table_name='extra_curricular-activities')
    op.drop_table('extra_curricular-activities')
