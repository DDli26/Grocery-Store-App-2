from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required
from .models import User, db, Products, Cart, Orders
from .sec import datastore
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal_with, marshal, fields
# import requests
from celery.result import AsyncResult
from .tasks import create_products_csv
import flask_excel as excel
import uuid

@app.get('/')
def home():
    return render_template("index.html")


@app.get("/admin")
@auth_required("token") #we need a token type authentication
@roles_required("admin")
def admin():  
    return "Admin Dashboard"


@app.get("/activate/instructor/<int:inst_id>")
@auth_required("token")
@roles_required("admin")
def store_manager_authorization(inst_id):#change the active attribute for this instructor, we can implement the store manager approval in this way
    instructor=User.query.get(inst_id)
    print("inside activate instructor")
    if instructor:
        instructor.active=True
        db.session.commit()
        return jsonify({"message": "Instructor Verified and Active"}), 200
    
    return jsonify({
        "message":"An error occured"
    }), 403

from datetime import datetime
@app.post("/user-login")
def user_login():#loggin in a user
    data=request.get_json()

    email=data.get("email")

    
    if not email:
        return jsonify({"message": "Please provide an email"}), 400
    
    user=datastore.find_user(email=email)
    if not user or user.active==False:
        return jsonify({"messsage":"User not found"}), 404
    

    if check_password_hash(user.password, data.get("password")):
        user.logged_in=True  #attribute changed 
        db.session.commit()
        
        return jsonify(
            {
                "token":user.get_auth_token(),
                "email": user.email,
                "role": user.roles[0].name,
                "id":user.id
                
            }
        ), 200  #will return the authentication token of the user.
    
    return jsonify({
        "message": "wrong password"
    }),  400

@app.get("/logout/<int:user_id>")
@auth_required("token")
def logout(user_id):
    user=datastore.find_user(id=user_id)
    if user:
        print("inside logout, user found")
        user.logged_in=False
        user.logout_time=datetime.utcnow()
        db.session.commit()
    
        return jsonify({"message":"User successfully logged out."}),200

    return jsonify({"message":"User not found"}),404
    # try:
    #     db.session.commit()
    #     return jsonify({"message":"user successfully logged out."}), 200
    # except:
    #     db.session.rollback()
    #     return jsonify({"message": "There was an error while logging out"}), 400

#for user registeration
@app.post("/user-register")
def user_register():
    data=request.get_json()
    email=data.get("email")
    if not email:
        return jsonify({"message": "Please provide an email"}), 400
    
    user=datastore.find_user(email=email)
    if not user:  #if email is unique, then register as a normal user
        print("trying to register")
        password=data.get("password")
        if not password:
            return jsonify({"message": "please provide a password for your account."}), 400
        datastore.create_user(
            email=email, password=generate_password_hash(password), roles=["stud"])
        
        try:
            db.session.commit()
            return jsonify({"message": "New user Successfully created"}), 200
        
        except:
            db.session.rollback()
            return jsonify({"message": "There was an error while adding the user to the database"}), 400
        
        
    

    else: #if email already exists in the database
        return jsonify({"message":"Email already exists, please choose a different email"}), 401
    


#registering as a manager
@app.post("/manager-register")
def manager_register():
    data=request.get_json()
    email=data.get("email")
    if not email:
        return jsonify({"message": "Please provide an email"}), 400
    
    user=datastore.find_user(email=email)
    if not user:  #if email is unique, then register as a normal user
        print("trying to register")
        password=data.get("password")
        if not password:
            return jsonify({"message": "please provide a password for your account."}), 400
        datastore.create_user(
            email=email, password=generate_password_hash(password), roles=["inst"], active=False )
        
        try:
            db.session.commit()
            return jsonify({"message": "New manager Successfully created"}), 200
        
        except:
            db.session.rollback()
            return jsonify({"message": "There was an error while adding the user to the database"}), 400
        
        
    

    else: #if email already exists in the database
        return jsonify({"message":"Email already exists, please choose a different email"}), 401
    

#checkout, for when a user checkout of cart, 
#first check if the products in cart are still in stock, if not, update the ones that are out of stock
#to the stock available, send a message to the front end telling them that the items have gone out of stock

#if everything is fine, proceed by clearing the cart and updating the product db
#if anything is to be updated, return new quantity, for each product

cart_fields={
    "user_id":fields.Integer, 
    "product_id": fields.Integer, 
    "quantity": fields.Integer, 
    "price":fields.Integer
    
}
@app.post("/checkout/<int:user_id>")
@auth_required("token")
@marshal_with(cart_fields)
def checkout(user_id):
    #items are the items in a given users carrt
    items=Cart.query.filter_by(user_id=user_id).all()
    flag=0
    updated_cart=None
    for item in items:
        #for each item check the quantity and if something is different, update it
        product_id=item.product_id
        quantity=item.quantity
        stock=Products.query.get(product_id)
        stock=stock.quantity
        
        
        if not (stock >=quantity): #update quantity to the largest possible in case current quantity is out of stock
            flag=1
            product=Products.query.get(product_id)
            
            cart_item=Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
            cart_item.quantity=product.quantity
           

            db.session.commit()

            # updated_cart=requests.get(f"localhost:5000/api/cart/{user_id}")
    if flag==1: #if even a single product was updated, return the cart
            print("updating cart")
            # updated_cart=requests.get(f"http://127.0.0.1:5000/api/cart/{user_id}").json()

            updated_cart=Cart.query.filter_by(user_id=user_id).all()
            return updated_cart, 401

        
    else: #if stock is present, delete cart and checkout, return a message and 200 response code, if res.ok then route to home
            #delete cart of the current user
        
            print("checking out in else block")
            order_id=str(uuid.uuid4())
            print('order id is of type ', type(order_id))
            for item in items: #update product db and remove item from that users cart
                product_id=item.product_id
                cart_quantity=item.quantity
                product=Products.query.get(product_id)
                product.quantity=product.quantity-cart_quantity
                product.total_units_sold+=cart_quantity #this is done so that store manager can download csv file

                #now let's update the orders table to store order info about the user
                total_price=item.price*cart_quantity
                
                order=Orders(order_id=order_id,user_id=user_id, product_id=product_id,product_name=product.name, quantity=cart_quantity,price=total_price)
                db.session.add(order)
                db.session.delete(item)
            
                
            

            db.session.commit()
                

            return {"message": "Everything in stock"}, 200

            
            

    

    # return {"message":"User Checked out successfully"}, 200


#for admin to approve users who are not active

user_fields={
    "id": fields.Integer,
    "email": fields.String,
    "active": fields.Boolean
}

@app.get("/users")
@auth_required("token")
@roles_required("admin")

def all_users():
    users=User.query.all()

    if len(users)==0:
        return jsonify({
            "message":"No user Found"
        }), 404
    

    return marshal(users, user_fields)







@app.get('/download-csv')
def download_csv():
    task=create_products_csv.delay() #run the celery task

    return jsonify({"task_id": task.id})

@app.get("/get-csv/<task_id>")
def get_csv(task_id): #js set interval function makes repetitive calls to it
    res=AsyncResult(task_id)  #create a async result object that can be used to fetch data from the result backend
    # print("inside get csv")
    # print(res.state)
    # print(res.finish())
    if res.ready(): #if only the result is ready, then this will be executed, remember we use celery to execute tasks that take a lot of time.
        filename=res.result #contains the csv file
        return send_file(filename, as_attachment=True) #file downloaded automatically

        # return jsonify({"message": "Task Complete"})
    
    else:
        return {"message": "Task Pending"}, 400
    
    
# @app.get("")




    #monthly report of user, Orders made=no. of orders, total spent, etc.

    

    
    