from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from sqlalchemy import CheckConstraint
from datetime import datetime
db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    # role_id=db.Column(db.String, db.ForeignKey("role.id"))
    # role=db.relationship("Role")
    # study_resource = db.relationship('StudyResource', backref='creator')
   #  user.logout_time> timedelta(minutes=2) and user.logged_in == False:
    logout_time=db.Column(db.DateTime, default=datetime.utcnow())
    
    logged_in=db.Column(db.Boolean(), default=False)
    cart=db.relationship("Cart", backref='user', cascade="all, delete")
    orders=db.relationship("Orders", backref='user', cascade="all, delete")
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    
    
    
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class StudyResource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    # creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    resource_link = db.Column(db.String, nullable=False)
    is_approved = db.Column(db.Boolean(), default=False)



class Category(db.Model):
   id=db.Column(db.Integer, primary_key=True)
   name=db.Column(db.String(120), nullable=False, unique=True)
   is_approved=db.Column(db.Boolean(), default=False)  #for admin approvals once store manager adds a category
   products=db.relationship('Products', backref='category', cascade="all, delete")

class Products(db.Model):
   id=db.Column(db.Integer, primary_key=True)
   name=db.Column(db.String(12), nullable=False)
#    mfd=db.Column(db.Date)
#    expiry=db.Column(db.Date)
   quantity=db.Column(db.Integer, nullable=False)
   rate_per_unit=db.Column(db.Integer, nullable=False)
   image=db.Column(db.String(1000))
   total_units_sold=db.Column(db.Integer, default=0)
   delete=db.Column(db.Boolean(), default=False)
   category_id=db.Column(db.Integer, db.ForeignKey('category.id'))
   cart=db.relationship("Cart", backref="product", cascade="all, delete")
   orders=db.relationship("Orders", backref="product", cascade="all, delete")
   

   __table_args__=(
      CheckConstraint('quantity >= 0', name="quantity constraint"),
      CheckConstraint("rate_per_unit>=0", name="rate constraint")
   )


class Cart(db.Model):
   id=db.Column(db.Integer, primary_key=True)
   user_id=db.Column(db.Integer, db.ForeignKey('user.id'))
   product_id=db.Column(db.Integer, db.ForeignKey("products.id"))
   quantity=db.Column(db.Integer)
   price=db.Column(db.Integer)
#    total_price=db.Column(db.Integer)

   __table_args__=(
      CheckConstraint("quantity>=0", name="quantity constraint"),
   )



#orders table, relationship between user and order, to generate a report
 #for this we do not need relationship i guess,   
class Orders(db.Model): #many to one with products, many orders can have the same product
    id=db.Column(db.Integer, primary_key=True)
    order_id=db.Column(db.String)  #using uuid4 for this
    user_id=db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    product_id=db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    product_name=db.Column(db.String())
    quantity=db.Column(db.Integer, nullable=False)
    price=db.Column(db.Integer, nullable=False)  #price per unit * quantity
    