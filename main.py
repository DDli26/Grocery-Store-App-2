from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security

from application.models import db, User, Role
from application.instances import cache
from config import DevelopmentConfig, Config
from application.resources import api
# from application.sec import datastore
from application.sec import datastore
from application.worker import create_celery_app #narendra used celery_app_init_
from application.tasks import daily_reminder, user_report
import flask_excel as excel 
from celery.schedules import crontab

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    cache.init_app(app, config={
        "CACHE_TYPE":"RedisCache",  #could be redis if this doesn't work
    "CACHE_DEFAULT_TIMEOUT":300
    })
    excel.init_excel(app)
    # app.security = Security(app, datastore)
    # datastore=SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    with app.app_context():  #cause in views.py we are importing current app which will only work if we open it with the current app instance

        import application.views
    # app.app_context().push()
    # return app, datastore
    return app

# app, datastore = create_app()
app=create_app()
celery_app=create_celery_app(app)

#celery beat
@celery_app.on_after_configure.connect #execute function after celery beat gets connected
def send_email(sender, **kwargs):
    #check if reminder email should be sent, after every 10 seconds, sends email if user has been logged out for more than 2 minutes
    sender.add_periodic_task(10,  #utc time, if no, no. of days is passed, the task gets executed everyday
        
        daily_reminder.s("Login Reminder"), name="email reminder"  #send email to those who haven't logged in, implememtation still left
    )


@celery_app.on_after_configure.connect
def send_order_summary(sender, **kwargs):
    sender.add_periodic_task(40,user_report.s("order summary"),  name="order summary"  )


    #every monday at 7:30 am 
    # sender.add_periodic_task(
    #     crontab(hour=7, minute=30, day_of_week=1),
    #     test.s('Happy Mondays!'),
    # )

#done



if __name__ == '__main__':      
    app.run(debug=True)