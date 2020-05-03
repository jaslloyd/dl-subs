"""Add name, team and paid column to get away from details column

Revision ID: 1ba895640e01
Revises: 
Create Date: 2018-05-11 18:03:57.874981

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1ba895640e01'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('username', sa.String(length=64), nullable=True),
                    sa.Column('password_hash', sa.String(
                        length=128), nullable=True),
                    sa.Column('last_seen', sa.DateTime(), nullable=True),
                    sa.Column('is_admin', sa.Boolean(), nullable=True),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_user_username'), 'user',
                    ['username'], unique=True)
    op.create_table('entry',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(length=150), nullable=True),
                    sa.Column('team', sa.String(length=150), nullable=True),
                    sa.Column('paid', sa.Integer(), nullable=True),
                    sa.Column('timestamp', sa.DateTime(), nullable=True),
                    sa.Column('user_id', sa.Integer(), nullable=True),
                    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_entry_timestamp'), 'entry',
                    ['timestamp'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_entry_timestamp'), table_name='entry')
    op.drop_table('entry')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###
