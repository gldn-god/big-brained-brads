# import os
# basedir = os.path.abspath(os.path.dirname(__file__))


# class Config(object):
#     DEBUG = False
#     TESTING = False
#     CSRF_ENABLED = True
#     SECRET_KEY = 'Honeymoonmanor123'
#     SQLALCHEMY_DATABASE_URI = os.environ['brains']


# class ProductionConfig(Config):
#     DEBUG = False


# class StagingConfig(Config):
#     DEVELOPMENT = True
#     DEBUG = True


# class DevelopmentConfig(Config):
#     DEVELOPMENT = True
#     DEBUG = True


# class TestingConfig(Config):
#     TESTING = True

# connection parameters
user = "postgres"
password = "Honeymoonmanor123"
host = "localhost"
database = "brains"
param_dic = {
    "host" : host,
    "database" : database,
    "user" : user,
    "password" : password
}