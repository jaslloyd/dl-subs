from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from app import db, app
#  Since the implementations are fairly generic, Flask-Login provides a mixin class called UserMixin that includes generic implementations that are appropriate for most user model classes.
from flask_login import UserMixin
from app import login
import jwt

# All models inherit from the Base Flask-SqlAlchemy Model


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    # This is a high-level view of the relationship between users and entries. For a one-to-many relationship, a db.relationship field is normally defined on the 'one' side and is used as a convenient way to get access to the 'many' side.
    # Argument 1 = Which Model class represents the many side
    # Argument 2 = Defines the name of a field that will be added to the objects of the 'many' class that points back at the 'one' object.
    # Argument 3 = Defines how the database query for the relationship will be issues
    entries = db.relationship('Entry', backref='author', lazy='dynamic')
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)

    # This method tells Python how to print objects of this class.
    def __repr__(self):
        return '<User {}>'.format(self.username)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'last_seen': self.last_seen,
            'is_admin': self.is_admin
        }

    def promote_user(self):
        self.is_admin = True

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self, expires_in=30):
        return jwt.encode(
            {'id': self.id, 'exp': datetime.utcnow() + timedelta(minutes=expires_in)},
            app.config['SECRET_KEY'], algorithm='HS256').decode('UTF-8')

    @staticmethod
    def verify_auth_token(token):
        try:
            id = jwt.decode(
                token, app.config['SECRET_KEY'], algorithm='HS256')['id']
            print(id)
        except Exception as e:
            print(e)
            return
        return User.query.get(id)


class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    team = db.Column(db.String(150))
    paid = db.Column(db.Integer)

    # Field will get indexed, useful for ordering and its utc time as default
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    # This References an id value from the users table
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # We should actually delete
    is_deleted = db.Column(db.Boolean, default=False)
    # Payment type
    payment_reference = db.Column(db.String(150))

    def __repr__(self):
        return '<Entry {}>'.format(self.name)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'team': self.team,
            'paid': self.paid,
            'timestamp': self.timestamp,
            'user_id': self.user_id,
            'is_deleted': self.is_deleted,
            'payment_reference': self.payment_reference
        }

# Flask-Login knows nothing about databases, it needs the application's help in loading a user. For that reason, the extension expects that the application will configure a user loader function, that can be called to load a user given the ID.


@login.user_loader
def load_user(id):
    return User.query.get(int(id))
