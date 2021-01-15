import pymongo, tweepy
from pymongo import MongoClient
import os

db_auth = "mongodb+srv://deivede:" + os.environ['mongodbkey'] + "@appnot.csb3u.gcp.mongodb.net/app_usr_db?retryWrites=true&w=majority"
cluster = MongoClient(db_auth)

db = cluster.appnot_usr_db
