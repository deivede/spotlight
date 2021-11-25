import tweepy
# from src.twitter.keys import *
# from keys import *
# from src.twitter.config import *
# from config import *
from src.twitter.heroku_keys import *
from src.twitter.heroku_config import *
import requests

def updateProfileImage(user):
    rawFriends = db.users.find({"screen_name": user}, {"twitter": 1})
    friends = rawFriends[0]["twitter"]

    for friend in friends:
        friendPic = friends[friend]['profile_image_url']
        picRequest = requests.get(friendPic)

        if picRequest.status_code == 404:
            friendData = api.get_user(user_id=friend)

            newPic = friendData.__dict__['_json']['profile_image_url']
            db.users.find_one_and_update({'screen_name': user}, {'$set': {'twitter.' + friend + '.profile_image_url': newPic}})

            print(friend + "pic updated")
