import tweepy
import os

oauthkey = os.environ['oauthkey']
oauthskey = os.environ['oauthskey']
tokkey = os.environ['tokkey']
tokskey = os.environ['tokskey']

auth = tweepy.OAuthHandler(oauthkey, oauthskey)
auth.set_access_token(tokkey, tokskey)
api = tweepy.API(auth)
