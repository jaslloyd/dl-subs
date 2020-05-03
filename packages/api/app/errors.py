from flask import jsonify
from app import app, db

@app.errorhandler(500)
def internal_error(error):
    # Rollsback any DB changes so we have a clean state
    db.session.rollback()
    return 500