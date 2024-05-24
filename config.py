class Config(object):
    DEBUG = False
    TESTING = False
    CACHE_TYPE="RedisCache"  #could be redis if this doesn't work
    CACHE_DEFAULT_TIMEOUT=300 #default is also 300, in case we don't specify

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SECRET_KEY = "thisissecter"
    SECURITY_PASSWORD_SALT = "thisissaltt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False  #we don't need form protection as we are using api which are protected with jwt
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token' #token present in header of the request and the name of the header is Authentication-Token
    SMTP_Server="localhost"
    SMTP_PORT=1025 #smtp server is now on port 1025
    SENDER_EMAIL="abhi.godara123@gmail.com"
    SENDER_PASSWORD="abhinandan"