#to prevent the program from going into circular import: two files importing each other
from flask_security import SQLAlchemyUserDatastore
from .models import db, User, Role
datastore=SQLAlchemyUserDatastore(db, User, Role)