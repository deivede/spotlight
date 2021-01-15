from src.instagram.heroku_config import *
from src instagram.heroku_keys import *
# from src.instagram.config import *
# from config import *

class userObject(object):
    def __init__(self, pic, id, screen_name, index):
        self.pic = pic
        self.id = id
        self.screen_name = screen_name
        self.index = index

def setViewStatusInstagram(user, friendId):
    query = "instagram." + friendId + ".view_status"
    boolObj = db.users.find({"screen_name": user}, {query: 1})

    boolStatus = boolObj[0]["instagram"][friendId]["view_status"]
    db.users.find_one_and_update({"screen_name": user}, {"$set": {query: not boolStatus}})

def getTrueViewStatusInstagram(user):
    users = db.users.find({"screen_name": user})
    userDict = users[0]["instagram"]

    return userDict

def setUsersArray(userDict):

    usersArray = []
    index = 1

    for user in userDict:
        if userDict[user]["view_status"] is True:
            _id = userDict[user]["id"][0]
            _pic = userDict[user]["profile_image_url"],
            _screen_name = userDict[user]["screen_name"][0],
            _index = index
            index = index + 1

            addUser = userObject(_pic, _id, _screen_name, _index)
            usersArray.append(addUser.__dict__)

    return usersArray
