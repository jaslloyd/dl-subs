from datetime import datetime, timedelta
import unittest
from app import app, db
from app.models import User, Entry

class UserModelCase(unittest.TestCase):
    def setUp(self):
        # This creates an in-memory db for the tests to use.
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
        db.create_all()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_password_hashing(self):
        u = User(username='John')
        u.set_password('super-secret-password')
        self.assertFalse(u.check_password('passsword-secret'))
        self.assertTrue(u.check_password('super-secret-password'))

    def test_admin_promotion(self):
        u = User(username='Jason')
        self.assertFalse(u.is_admin)
        u.promote_user()
        self.assertTrue(u.is_admin)

    def test_auth_token_generation(self):
        u = User(username='Bob')
        self.assertTrue(len(u.generate_auth_token()) > 0)
        
if __name__ == '__main__':
    unittest.main(verbosity=2)