from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from logging.handlers import RotatingFileHandler, logging
import os

app = Flask(__name__, static_folder="./static3", template_folder="./static")
app.config.from_object(Config)
# DB instance with the flask instance passed to it
db = SQLAlchemy(app)
# Migrate instance takes the flask instance and the db instance
migrate = Migrate(app, db)
login = LoginManager(app)

CORS(app)

if not app.debug:
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler(
        'logs/subs_api.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Subs Application Startup')

# The bottom import is a workaround to circular imports, a common problem with Flask applications
from app import routes, models, errors
