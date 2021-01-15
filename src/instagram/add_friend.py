from keys import *
from config import *

class userObject(object):
    def __init__(self, id, name, screen_name,  profile_image_url):
        self.id = id,
        self.name = name,
        self.screen_name = screen_name,
        self.profile_image_url = profile_image_url


def getFollowings():
    UUID = api.generate_uuid()
    followingData = api.user_following(api.authenticated_user_id, rank_token=UUID)

    return followingData

def setFollowingsDict(followingData):
    followingList = {}

    for user in followingData['users']:
        _id = user['pk']
        _name = user['full_name']
        _screen_name = user['username']
        _profile_image_url = user['profile_pic_url']

        newUser = userObject(_id, _name, _screen_name, _profile_image_url)
        followingList.update({ _id: newUser.__dict__ })

    print(followingList)
    return followingList

def pushFollowingToDB(followingList):
    print(len(followingList))
    for i in range(len(followingList)):
        index = list(followingList)[i]
        key = 'instagram.' + str(index)
        values = list(followingList.values())[i]
        db.users.find_one_and_update({'screen_name': 'deivede'}, {'$set': { key: values}})
