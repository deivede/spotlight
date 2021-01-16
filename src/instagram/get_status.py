from src.instagram.heroku_config import *
from src.instagram.heroku_keys import *
# from src.instagram.keys import api
# from src.instagram.config import db

def getActiveStories(userId):
    storiesDict = api.user_story_feed(userId)
    storiesItems = storiesDict["reel"]["items"]

    return storiesItems

def setStoriesJSON(storiesItems):
    newStories = len(storiesItems)
    lastReel = storiesItems[-1]["taken_at"]

    storiesJSON = {
        "new_stories": newStories,
        "last_reel": lastReel
    }

    return storiesJSON
