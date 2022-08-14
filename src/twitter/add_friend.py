from src.twitter.heroku_keys import *
from src.twitter.heroku_config import *
# from src.twitter.keys import *
# from src.twitter.config import *
import pymongo, tweepy
from pymongo import MongoClient

class userObject(object):
    def __init__(self, id, id_str, name, screen_name, last_tweet, last_call_tweets, profile_image_url, url, protected, view_status):
        self.id = id,
        self.id_str = id_str,
        self.name = name,
        self.screen_name = screen_name,
        self.last_tweet = last_tweet,
        self.last_call_tweets = last_call_tweets,
        self.profile_image_url = profile_image_url,
        self.url = url,
        self.protected = protected,
        self.view_status = view_status

def addUser(user):
    db.users.insert_one({'screen_name': user, 'twitter': {}})

def getFriends(friendId):
    friendsData = api.friends(friendId, count=200, skip_status=1, include_user_entities=False)

    print(len(friendsData))

    return friendsData

def searchUsers(quer):
    users = api.search_users(quer)

    return users

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
            _last_tweet =  ""
            _last_call_tweets = []
            _view_status = False

            newFriend = userObject(_id, _id_str, _name, _screen_name, _last_tweet, _last_call_tweets, _profile_image_url, _url, _protected, _view_status)
            friendsList.update({ _id_str : newFriend.__dict__ })

    return friendsList

def pushFriendsToDB(friends, user):
    for i in range(len(friends)):
        index = list(friends)[i]
        key = 'twitter.' + index
        values = list(friends.values())[i]
        db.users.find_one_and_update({'screen_name': user}, {'$set': { key: values}})

def addFriendToDB(friend, user):
        newFriend = api.get_user(friend)

        friendsList = {}

        _id = newFriend.id
        _id_str = newFriend.id_str
        _name = newFriend.name
        _screen_name = newFriend.screen_name
        _profile_image_url = newFriend.profile_image_url
        _url = newFriend.url
        _protected = newFriend.protected
        _last_tweet =  ""
        _last_call_tweets = []
        _view_status = False

        newFriend = userObject(_id, _id_str, _name, _screen_name, _last_tweet, _last_call_tweets, _profile_image_url, _url, _protected, _view_status)
        friendsList.update({ "obj": newFriend.__dict__ })

        key = "twitter." + friend
        db.users.update({'screen_name': user}, {'$set': { key: friendsList["obj"]}})
