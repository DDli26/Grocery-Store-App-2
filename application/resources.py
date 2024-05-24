from flask_restful import Resource, Api, reqparse, fields, marshal_with  #to serialize our respponse object or in simple terms, to decide what our response object will look like when rendered.
from .models import StudyResource, db, Category, Products, Cart
from .instances import cache

from flask import request, jsonify, current_app
from flask_security import auth_required, roles_required,roles_accepted, current_user
import json
api = Api(prefix="/api")



#Api to create a new category, delete a category, update a category.
parser_category=reqparse.RequestParser()
parser_category.add_argument("name", type=str, help="name of the category to be added to the database")
parser_category.add_argument("id", type=int, help="id of the category to be deleted/updated")

#parser for category

category_fileds={
    "id":fields.Integer,
    "name":fields.String
}

class CategoryAPi(Resource):

    @auth_required("token")
    @cache.cached(timeout=30)
    @marshal_with(category_fileds)
    def get(self):
        categories=Category.query.filter_by(is_approved=True).all() #only those categories that are approved
        print("inside category api")

        if categories:
            return categories, 200
        
        return {"message":"No Categories found"}, 404
    

    @auth_required("token")
    @roles_required("admin")  #store manager can only make a request for admin to add the catgory, ther is different api for that
    def post(self):
        #add a new category with the name passed in the parser.
        category_name=parser_category.parse_args()
        category=Category(name=category_name["name"], is_approved=True)

        db.session.add(category)

        try:

            db.session.commit()
            with current_app.app_context():
                cache.clear()
            return {"message": "category successfully added to the database"},200

        except:
            db.session.rollback()
            return {"message":"there was an error while adding the category"}, 400
        
        
    @auth_required("token")
    @roles_accepted('admin', 'inst')
    def put(self):
        #find the category using id and update the name
        category_id_name=parser_category.parse_args()
        category=Category.query.get(category_id_name["id"])
        category.name=category_id_name["name"]

        try:
            db.session.commit()
            with current_app.app_context():
                cache.clear()
            return {"message": "category name successfully updated"},200

        except:
            db.session.rollback()
            return {"message":"there was an error while updating the category."}, 400

    @auth_required("token")
    @roles_required("admin")    
    def delete(self):
        #find the category to be deleted using id and delete it, 
        category_id=parser_category.parse_args()
        category=Category.query.get(category_id["id"])

        db.session.delete(category)

        try:
            db.session.commit()
            with current_app.app_context():
                cache.clear()
            return {"message": "category successfully deleted the database"},200

        except:
            db.session.rollback()
            return {"message":"there was an error while deleting the category"}, 400

        
api.add_resource(CategoryAPi, "/categories")



#Product api for getting products, deleting a product given id and, updating product data and adding a product

#parser
parser_product=reqparse.RequestParser()

parser_product.add_argument("id", type=int, help="id of the product")
parser_product.add_argument("name", type=str, help="name of the product")
# parser_product.add_argument("mfd", type=str, help="manufacture date of the product")   #change type of date
# parser_product.add_argument("expiry", type=str)
parser_product.add_argument("quantity", type=int, help="quantity of the product, used to update and post")
parser_product.add_argument("rate_per_unit", type=int, help="price of each product")
parser_product.add_argument("image", type=str, help="link of image of the product")
parser_product.add_argument("category_id", type=int, help="id of the category to which the product belongs")


#product_fileds for marshal_with
product_fileds={
    "id":fields.Integer,
    "name": fields.String, 
    "quantity":fields.Integer, 
    "rate_per_unit":fields.Integer,
    "image":fields.String,
    "category_id":fields.Integer
}

class Product_Api(Resource):

    @auth_required("token")
    @marshal_with(product_fileds)
    def get(self, category_id=0): #get all the products

        if category_id==0:  #if no category_id is passed, return all the products
            products=Products.query.all()

            if products:
                return products, 200
            
            return {"message":"no products found"}, 404
        
        else:  #return products of the given category id

            products=Products.query.filter_by(category_id=category_id).all()

            if products:
                    return products, 200
                
            else:
                    return {"message": "no products found"}, 404
    
    @auth_required("token")
    @roles_accepted("admin","inst")  #need both admin and store manager for this
    def post(self):
        print("entered inside function")
        print("parsing arguments")
        products=parser_product.parse_args()
        print("error did not occur when parsing")
        print(products)
        products["name"]=products["name"].title()
        if Category.query.get(products["category_id"]).is_approved: #only add to category if the category is approved
            product=Products(name=products["name"], quantity=products["quantity"], rate_per_unit=products["rate_per_unit"], image=products["image"], category_id=products["category_id"] )
            db.session.add(product)

            try:
                db.session.commit()
                with current_app.app_context():
                    cache.clear()
                return {"message":"product added to db"}, 200
            except:
                db.session.rollback()
                return {"message":"there was an error while adding product to the db"}, 400
            
        return {"message":"there was an error while adding product to the db"}, 400
        
    #update product quantity or name or price, based on checkout and all that stuff

    @auth_required("token")
    @roles_accepted("admin","inst")
    def put(self):
        updated_product=parser_product.parse_args()

        product=Products.query.get(updated_product["id"])

        product.name=updated_product["name"]
        product.quantity=updated_product["quantity"]
        product.rate_per_unit=updated_product["rate_per_unit"]
        product.category_id=updated_product["category_id"]

        try:
            db.session.commit()
            with current_app.app_context():
                cache.clear()
            return {"message":"product was updated successfully"}
        
        except:
            db.session.rollback()
            return {"message":"there was an error while updating the product"}
        
    
    #deleting a given product by id
        
    @auth_required("token")
    @roles_accepted("admin")  #only admin, store manager can just make a request
    @marshal_with(product_fileds)
    def delete(self):
        product_id=parser_product.parse_args()
        product_id=product_id["id"]

        product=Products.query.get(product_id)

        db.session.delete(product)

        try:
            db.session.commit()
            # products=Products.query.all()
            with current_app.app_context():
                cache.clear()
            return {"message":"product was deleted from the database"}, 200
        
        except:
            db.session.rollback()
            return {"message":"there was an error while deleting the product"}, 400
        

api.add_resource(Product_Api, "/products", "/products/<int:category_id>")





#category addition for store manager, this is used so that store manager can make requests to admin
#to approve categories, we will have a post method to add a category to the db but make that
#the is_approved attribute is set to false

#we need a get method but that should be used by both admin and store manager, 
# but the put method can only be used by the admin

approval_fields={
    "id":fields.Integer,
    "name":fields.String
}

class Approval_api(Resource):

    @auth_required("token")
    @roles_required("admin")
    @marshal_with(approval_fields)
    def get(self):  #used to get all the categories that have not been approved yet
        print("inside approval api")
        categories=Category.query.filter_by(is_approved=False).all()
        print(categories)

        if categories:
            return categories, 200
        
        
        return {"message":"Currently there are no categories waiting for approval"}, 404
        
    @auth_required("token")
    @roles_required("inst")  
    def post(self): #for store manager to add category, very similar to categories api post method except is_approved 
        category_name=parser_category.parse_args()  #same parser should work
        category=Category(name=category_name["name"])

        db.session.add(category)

        try:
            db.session.commit()
            return {"message": "category successfully added to the database"},200

        except:
            db.session.rollback()
            return {"message":"there was an error while adding the category"}, 400
        

    @auth_required("token")
    @roles_required("admin")   #approve a category addition request
    @marshal_with(approval_fields)
    def put(self):  #update the is_approved attribute of the category with the given id to True.
        category=parser_category.parse_args()
        category_id=int(category["id"])

        category=Category.query.get(category_id)
        category.is_approved=True

        try:
            db.session.commit()
            categories=Category.query.filter_by(is_approved=False).all()
            return categories #return new categories for updating the page
        
        except:
            db.session.rollback()

            return {"message": "There was an error while updating the category"}, 401
        
    




api.add_resource(Approval_api, "/approval/categories")


        
#api for home page, returns a JSON with keys as category names and respective products in a sub-list

#this is to be cached as it gets info about all the products

class Home_page_API(Resource):
    
    @auth_required("token")  #log in required
    def get(self):
        categories={}
        Categories=Category.query.all()  #list of categories, where each category is an object

        for category in Categories: #category is a object
            #using category.id we have to access the products of each category
            print(category.products)
            categories[category.name]=[] #each key in categories is a list 
            for product in category.products:  #appending product detail for each product to categories, making each value a list of list
                categories[category.name].append([product.id, product.name, product.rate_per_unit, product.quantity, product.image ,product.category_id])


        print(categories)   
        print("keys: ", categories.keys())




        return categories
        # return {"message":"working fine"}, 200
    


api.add_resource(Home_page_API, "/home")



#cart api, for adding items to cart, 
#get method to get contents of the cart, and total price of the cart maybe?, get returns user id and a list of list, each sublist is of length 2, being name of product and quantity
#post to add items to cart
#put to update cart
#delete to delete items from the cart




cart_parser=reqparse.RequestParser()
cart_parser.add_argument("product_id", type=int, help="id of the product")
cart_parser.add_argument("user_id", type=int, help="id of the user who bought the product")

cart_parser.add_argument("stock", type=int, help="used so that user cannot add more to cart than the stock in the db")

cart_fields={
    "user_id":fields.Integer, 
    "product_id": fields.Integer, 
    "quantity": fields.Integer, 
    "price":fields.Integer
    
}
class Cart_API(Resource):

    @auth_required("token")
    # @cache.cached(timeout=30)
    @marshal_with(cart_fields)
    def get(self, user_id):
        # info=cart_parser.parse_args()
        # user_id=user_id
        cart=Cart.query.filter_by(user_id=user_id).all()  #list of cart objects


        return cart
        


    @auth_required("token")
    def post(self):
        info=cart_parser.parse_args()
        product_id=info["product_id"]
        user_id=info["user_id"]
        print(user_id)
        #find if the product is already in cart of the user, if so, just increase the quantity by 1
        bought_before=Cart.query.filter(Cart.user_id == user_id, Cart.product_id==product_id).first()
        if bought_before:
            #check if item is in stock
         stock=Products.query.get(product_id).quantity
         if bought_before.quantity+1<=stock:
            bought_before.quantity+=1 #update quantity
            try:
                db.session.commit()
                with current_app.app_context():
                    cache.clear()
                return {"message":"Item already in cart, quantity updated"}, 200

            except:
                db.session.rollback()
                return {"message": "The quantity could not be updated"}, 400
         else:
             return {"message": "Out of Stock"}
            
        else: #if not bought before, check if product is in stock, and if so, add to db
            #first find the price of the product
            stock=Products.query.get(product_id).quantity
            if stock>0:



                product=Products.query.get(product_id)
                price=product.rate_per_unit
                cart_item=Cart(user_id=user_id, product_id=product_id, quantity=1, price=price)

                db.session.add(cart_item)

                try: 
                    db.session.commit()
                    
                    return {"message": "Item added to cart as a new item"}, 200
            
                except:
                    db.session.rollback()

                    return {"message": "There was an error while adding the product to the cart as a new product"}

            return {"message": "Out of Stock"}

    
        
    

api.add_resource(Cart_API, "/cart", "/cart/<int:user_id>")



#cart product api, this is for the cart, when adding to cart, we need to check if the given products quantity
#is still there in the db, we should not add more quanity to cart then what is available
#to tackle this, we create a get api that takes a product_id and returns that product object
#we can use this to make our job easier for getting total of a user and all that, and can also use this



#Api for Search functionality

parser_search=reqparse.RequestParser()

parser_search.add_argument("query_string", type=str, help="The String the user is searching for")

search_fields={
    "id":fields.Integer,
    "name": fields.String, 
    "quantity":fields.Integer, 
    "rate_per_unit":fields.Integer,
    "image":fields.String,
    "category_id":fields.Integer
}

class Search_Api(Resource):


    @marshal_with(search_fields)
    def get(self, search_string):
        
        
        if search_string:
                        print("serch_string exists")
                    # if search_string.isalpha():  #validation to make sure nothing other than alphabets is typed in the form
                    #first match the string with a category.
                        category_id=-1
                        #if found, display all product of the category using get Products api
                        categories=Category.query.filter_by(is_approved=True).all()# list of category objects
                        for category in categories:
                            print(category.name.lower(),search_string.lower(), category.name.lower()==search_string.lower())
                            if category.name.lower()==search_string.lower():
                                category_id=category.id
                                # break
                        if category_id!=-1: #if the search string matches a category
                            products=Products.query.filter_by(category_id=category_id).all()
                            return products, 200

                #now we have searched by category, time to search if the search string actually matches with atleast 60% of any product
                        search_string=search_string.title()
                        product_list=Products.query.filter(Products.name.like(f"%{search_string}%")).all()

                        #now search for product names that are similar to the search String
                        product_list60=Products.query.all()  #list of objects
                        for product in product_list60:
                            match_count=0
                            for c in product.name:
                                if c in search_string:
                                    match_count+=1
                            
                            if match_count>=int(len(product.name)*0.60):  #if 60 percent of the words match
                                if product not in product_list:
                                    product_list.append(product)

                            

                        return product_list, 200
        else:

            return {"message": "no such item in the database"}, 404


                
                
        


api.add_resource(Search_Api, "/search-results/<search_string>")



#last api for product deletion approval from admin
product_fileds={
    "id":fields.Integer,
    "name": fields.String, 
    "quantity":fields.Integer, 
    "rate_per_unit":fields.Integer,
    "image":fields.String,
    "category_id":fields.Integer
}
parser_product2=reqparse.RequestParser()
parser_product2.add_argument("id", type=int, help="id of the product. Used for updating product delete attribute to true")

# parser_product.add_argument("id", type=int, help="id of the product")

class Product_Approvals(Resource):

    @auth_required("token")
    @roles_required("admin")
    @marshal_with(product_fileds)
    def get(self):
        #api to return all the products that are to be deleted on the request of the store manager
        products=Products.query.filter_by(delete=True).all()
        print(products)

        if products:
            print("condition true returning one product")
            return products
        else:
            print("No product deletion request found")
            return {"message":"No product deletion request found"}, 400
        
    
    @auth_required("token")
    @roles_accepted("inst", "admin")
    def put(self): #this will alter the delete attribute to True based on the passed product id. Used only by store manager
        product_id=parser_product2.parse_args()
        product_id=product_id["id"]

        product=Products.query.get(product_id)
        product.delete=not(product.delete) #alter the products delete attrribute, helps in 
        try:
            db.session.commit()
            return {"message": "Deletion request sent for admin approval"}, 200
        
        except:
            db.session.rollback()
            return {"message": "there was an error while deleting the product"}, 400
        
    
api.add_resource(Product_Approvals, "/approval/products")

