import tweepy
from src.twitter.heroku_keys import *
from src.twitter.heroku_config import *
# from src.twitter.keys import *
# from src.twitter.config import *
# from keys import *

# def getFriend(user, friendId):
#     twitter = "twitter." + friendId
#     friendDict = db.users.find({"screen_name": user}, {twitter: 1})
#
#     print(friendDict[0]["twitter"][friendId])
#
#     return friendDict[friendId]["id_str"][0]

def getNewTweets(user, friendId):

    twitter = "twitter." + friendId
    friendLastTweet = twitter + ".last_tweet.0"

    friendDict = db.users.find({"screen_name": user}, {twitter: 1})

    lastTweet = friendDict[0]["twitter"][friendId]["last_tweet"][0]
    id = friendDict[0]["twitter"][friendId]["id"][0]

    newTweets = api.user_timeline(since_id=lastTweet, user_id=id, exclude_replies="true")

    newLastTweet = newTweets[0].id
    db.users.update_one({"screen_name": user}, { "$set": { friendLastTweet: newLastTweet }})

    return newTweets

def setTweetsJSON(newTweets):
    TweetsArray = []

    for i in range(len(newTweets)):
        TweetsArray.append(newTweets[i].id_str)

    newTweetsLen = len(newTweets)

    TweetsJSON = {
        "new_tweet": newTweetsLen,
        "tweets_array": TweetsArray
    }

    print(TweetsArray)

    return TweetsJSON
