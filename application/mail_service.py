from smtplib import SMTP #class used to create the smtp client
#we also need to create a message and for this we will be using smtp email, email.mime, 
#mime is used to tell the type of the message/email, multipart, mimetext etc
from email.mime.text import MIMEText  #content type of email is tex/html
from email.mime.multipart import MIMEMultipart


SMTP_Server="localhost"
SMTP_PORT=1025 #smtp server is now on port 1025
SENDER_EMAIL="abhi.godara123@gmail.com"
SENDER_PASSWORD="abhinandan"

#function to send message to a user

def send_message(to, subject, content_body):
    msg=MIMEMultipart()
    msg["to"]=to
    msg["subject"]=subject
    msg["From"]=SENDER_EMAIL

    msg.attach(MIMEText(content_body, "html"))
    client=SMTP(host=SMTP_Server, port=SMTP_PORT)

    client.send_message(msg=msg)
    client.quit()


# send_message("arjun@gmail.com", 'test', "<html>Hello narendra</html>")
    
def send_order_summary(to, subject, content_body):
    msg=MIMEMultipart()
    msg["to"]=to
    msg["subject"]=subject
    msg["From"]=SENDER_EMAIL

    msg.attach(MIMEText(content_body, "html"))
    client=SMTP(host=SMTP_Server, port=SMTP_PORT)

    client.send_message(msg=msg)  #just to send the mail, content is what is inside content body
    client.quit()


# send_order_summary("arjun@email.com", "test", "<html>USer order summary</html>")