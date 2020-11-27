import tweepy
from keys import *
from config import *

def updateProfileImage(user, friendId):
    id = friendId
    friendData = api.get_user(user_id=id)

    friendPic = friendData.__dict__['_json']['profile_image_url']
    db.users.find_one_and_update({'screen_name': user}, {'$set': {'twitter.' + id + '.profile_image_url': friendPic}})
