from celery import Celery, Task

celery_app=Celery()   #celery instance
# celery_app.config_from_object("celeryconfig")  #connection celery to redis

#lets say we want to use the flask-sqlalchemy, for that we need to run it in the application context, and out tasks should
#also run in application context, there fore we need to make changes in worker

def create_celery_app(app):
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
               return self.run(*args, **kwargs) #trying to run task in applicationn context, to have access to db and stuff
    celery_app=Celery(app.name, task_cls=FlaskTask)  #??
    celery_app.config_from_object("celeryconfig")
    # celery_app.set_default()  #to tell the compiler that the current running app is the default celery app
    return celery_app
