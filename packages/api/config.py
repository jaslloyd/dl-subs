import os
basedir = os.path.abspath(os.path.dirname(__file__))

''' ...instead of putting my configuration in the same place where I create my application I will use a slightly more elaborate structure that allows me to keep my configuration in a separate file.

As the application needs more configuration items, they can be added to this class, and later if I find that I need to have more than one configuration set, I can create subclasses of it.
(https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iii-web-forms)
'''


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'magic-key-password'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')

    # This is to signal the application every time a change is about to be made in the database.
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    STRIPE_KEY = os.environ.get('STRIPE_KEY')
