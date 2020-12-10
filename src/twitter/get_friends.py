# from src.twitter.config import *
from src.twitter.heroku_config import *

class friendObject(object):
    def __init__(self, pic, id, link, screen_name):
        self.pic = pic
        self.id = id
        self.link = link
        self.screen_name = screen_name

def setViewStatus(user, friendId):
    query = "twitter." + friendId + ".view_status"
    boolObj = db.users.find({"screen_name": user}, {query: 1})

    boolStatus = boolObj[0]["twitter"][friendId]["view_status"]
    db.users.find_one_and_update({"screen_name": user}, {"$set": {query: not boolStatus}})


def getTrueViewStatus(user):
    friends = db.users.find({"screen_name": user}, {"twitter": 1})
    friendsDict = friends[0]["twitter"]

    return friendsDict

def setFriendsArray(friendsDict):

    friendsArray = []

    for i in friendsDict:
        if friendsDict[i]["view_status"] is True:
            _id = friendsDict[i]["id_str"][0]
            _pic = friendsDict[i]["profile_image_url"],
            _screen_name = friendsDict[i]["screen_name"][0],
            _link = friendsDict[i]["url"]

            addFriend = friendObject(_pic, _id, _link, _screen_name)
            friendsArray.append(addFriend.__dict__)

    return friendsArray
