from keys import *
from config import *
import requests

def UpdateUserPic(user):
    rawFriends = db.users.find({"screen_name": user}, {"instagram": 1})
    friends = rawFriends[0]["instagram"]

    for friend in friends:
        friendPic = friends[friend]['profile_image_url']

        friendData = api.user_info(friend)

        newPic = friendData['user']['profile_pic_url']
        db.users.find_one_and_update({'screen_name': user}, {'$set': {'instagram.' + friend + '.profile_image_url': newPic}})

        print(friend + "pic updated")


def addField():
    document = db.users.find_one({'screen_name': 'deivede'})
    instagramUsers = document["instagram"]

    for user in instagramUsers:
        key = 'instagram.' + user + '.view_status'
        db.users.find_one_and_update({'screen_name': 'deivede'}, {'$set': { key: False}})
