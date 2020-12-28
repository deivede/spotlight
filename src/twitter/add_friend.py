import tweepy
from keys import *
from config import *
import pymongo, tweepy
from pymongo import MongoClient

class userObject(object):
    def __init__(self, id, id_str, name, screen_name, last_tweet, profile_image_url, url, protected, view_status):
        self.id = id,
        self.id_str = id_str,
        self.name = name,
        self.screen_name = screen_name,
        self.last_tweet = last_tweet,
        self.profile_image_url = profile_image_url
        self.url = url,
        self.protected = protected,
        self.view_status = view_status

def getFriends(friendId, count):
    friendsData = api.friends(friendId , count=count)
    return friendsData


def setFriendsDict(friendsData):

    friendsList = {}

    for i in range(len(friendsData)):
            _id = friendsData[i].id
            _id_str = friendsData[i].id_str
            _name = friendsData[i].name
            _screen_name = friendsData[i].screen_name
            _profile_image_url = friendsData[i].profile_image_url
            _url = friendsData[i].url
            _protected = friendsData[i].protected
            _last_tweet = friendsData[i].status.id
            _view_status = False

            newFriend = userObject(_id, _id_str, _name, _screen_name, _last_tweet, _profile_image_url, _url, _protected, _view_status)
            friendsList.update({ _id_str : newFriend.__dict__ })

    return friendsList

def pushFriendsToDB(friends):
    for i in range(len(friends)):
        index = list(friends)[i]
        key = 'twitter.' + index
        values = list(friends.values())[i]
        db.users.find_one_and_update({'screen_name': 'deivede'}, {'$set': { key: values}})
