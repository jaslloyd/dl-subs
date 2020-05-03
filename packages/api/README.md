# DL Subs Back-end application

The back-end application will be developed in Python. 

Reasons for choosing Python:

* Easy to get started
* Flask is an easy to use quick start server library we can use to get first version done quickly
* Dive deeper into Python3 and its changes.

[Hello World in Flask](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)
# Getting Started

Python uses the concept of virtual environments. A virtual environment is a complete copy of the Python interpreter. When you install packages in a virtual environment, the system-wide Python interpreter is not affected, only the copy is.

Create a virtual environment by running: `python3 -m venv venv`

This will create a Virtual Environment called venv.

Activate your virtual environment by running: `source venv/bin/activate`

Install the dependencies by running: `pip install -r requirements.txt`

# Project setup

In Python, a sub-directory that includes a __init__.py file is considered a package, and can be imported. When you import a package, the __init__.py executes and defines what symbols the package exposes to the outside world.


# Libraries Used and Notes

flask - Flask is what will be providing our backend server. It is an easy quick start library. It has excellent documentation/tutorials and has been around a long time.

flask-sqlalchemy - an extension that provides a Flask-friendly wrapper to the popular SQLAlchemy package, which is an Object Relational Mapper or ORM. ORMs allow applications to manage a database using high-level entities such as classes, objects and methods instead of tables and SQL. The job of the ORM is to translate the high-level operations into database commands. The nice thing about SQLAlchemy is that it is an ORM not for one, but for many relational databases. SQLAlchemy supports a long list of database engines, including the popular MySQL, PostgreSQL and SQLite.

flask-migrate - This extension is a Flask wrapper for Alembic, a database migration framework for SQLAlchemy.

 * `flask db migrate -m "users table"` - Generated the code for the migrations in the migrations folder. -m option is just to add a comment to the migration scripts.

 * The scripts that are generated have two functions upgrade and downgrade. Upgrade applies the migration and downgrade function removed it. This allows Alembic to migrate the database to any point in the history, even to older versions, by using the downgrade path.

 * `flask db migrate` command does not make any changes to the database, it just generated the migration script. To apply changes we need to run `flask db upgrade`

 flask-login - This extension manages the user logged-in state, so that for example users can log in to the application and then navigate to different pages while the application "remembers" that the user is logged in. It also provides the "remember me" functionality that allows users to remain logged in even after closing the browser window

 `export FLASK_DEBUG=1` - allows flask to be started in debug mode when `flask run` is kicked off. When debug mode is enabled, it allows for flask to display errors in the browser. When the debug mode is disabled a generic error page is displayed to make sure sensitive information is not displayed.

 
