from celery import shared_task
from .models import Products, User, Role, db
import flask_excel as excel
from .mail_service import send_message, send_order_summary
from jinja2 import Template

#ignore result= False to store the result in the result backend, tht way result is not ignored
@shared_task(ignore_result=False) #can also user @celery_app.task() decorator
def create_products_csv():
    print("inside create products_csv task")
    product_res=Products.query.with_entities(Products.id, Products.name, Products.rate_per_unit, Products.quantity,Products.total_units_sold).all()

    csv_output=excel.make_response_from_query_sets(product_res, ["id", "name", "rate_per_unit", "quantity","total_units_sold"], "csv", filename="products.csv")
    filename="test.csv"
    #this file we will save in the redis server i guess and from the server we will return 
    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename  #whatever is returned from the celery task, will be stored in the redis backend
    

# @shared_task(ignore_result=True)  #sending email
from datetime import datetime, timedelta
@shared_task(ignore_result=True)  #sending email
def daily_reminder(subject): #for sending a daily message
    users=User.query.filter(User.roles.any(Role.name == "stud")).all()
    for user in users:
        print("inside for loop")
        print("if conditon is ", user.logout_time - datetime.utcnow() > timedelta(minutes=2) and user.logged_in == False )
        #check if user has not visted in the past 2 minutes and user is not a admin or store manager
        print("difference",  datetime.utcnow()- user.logout_time )
        print("timedelta", timedelta(minutes=2))
        if datetime.utcnow() - user.logout_time> timedelta(minutes=2) and user.logged_in == False:
            with open('./application/test.html','r') as f:
                template=Template(f.read())
                

                send_message(user.email, subject, template.render(email=user.email))#daily email reminder, in render function , we can pass some data like variables that are specific to a user

    return "OK"


@shared_task(ignore_result=True) #crontab is for when to execute a function, what function to execute is user_report
def user_report(subject): #send a mail that has info about everything a user ordered, basically check the orders table and for every user, send the report based on the table info and then remove those rows from the table
    users=User.query.filter(User.roles.any(Role.name == "stud")).all()
    # orders=[]
    already_grouped_order_id=[]
    for user in users:
        #for each user, send a mail that shows all the order given by a user until the mail is sent, after this, 
        #remove order data from the orders table
        
        #step 1, group orders by order id
        orders=[]
        for order1 in user.orders:
            order_id=order1.order_id 
            order_group=[]
            if order_id not in already_grouped_order_id: #if order id has already been grouped, don't enter the loop
                for order2 in user.orders:
                    if order2.order_id==order_id:
                        order_group.append(order2)
                        #once orders are grouped, delete them from the orders table to prevent duplicated
                    
                #to prevent duplicates, lets make a list of all the order id's that have been grouped already
                already_grouped_order_id.append(order_id)

                orders.append(order_group)

        #now clear the databse of all the orders for the current user in loop
        for order in user.orders:
            db.session.delete(order)
        try:
            db.session.commit()
            print("database cleared for user ", user.id)
        except:
            db.session.rollback()
            print("there was an error while deleting entries from orders table")
            
        with open('./application/order_summary.html','r') as f: #send email
            template=Template(f.read())

            send_order_summary(user.email, subject, template.render(orders=orders))


        
        print(f"orders for user {user.id}", orders)



            


