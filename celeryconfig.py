broker_url="redis://localhost:6379/1"
result_backend="redis://localhost:6379/2"    
#If you want to keep track of the tasks’ states, Celery needs to store or send the states TO  a backend
#can user redis a broker and rabitMq/redis as a backend
timezone = "Asia/Kolkata"
broker_connection_retry_on_startup=True
