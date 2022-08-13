
import os


class Config(object):
    SECRET_KEY =  "supersekrit"
    SQLALCHEMY_DATABASE_URI =  "sqlite:///app.sqlite3"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TWITTER_OAUTH_CLIENT_KEY = os.environ['oauthkey']
    TWITTER_OAUTH_CLIENT_SECRET = os.environ['oauthskey']
