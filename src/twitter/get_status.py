import tweepy
# from src.twitter.heroku_keys import *
# from src.twitter.heroku_config import *
from src.twitter.keys import *
from src.twitter.config import *
# from keys import *


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

# def setTweetsLists(user, friendId):
#
#     twitter = "twitter." + friendId
#     filterWords = twitter + ".filter_words.contain"
#
#     friendDict = db.users.find({"screen_name": user}, {twitter: 1})
#     id = friendDict[0]["twitter"][friendId]["id"][0]
#     containWords = friendDict[0]["twitter"][friendId]["filter_words"]["contain"]["words"]
#
#     newTweets = api.user_timeline(user_id=id, exclude_replies="true")
#
#     for tweet in range(len(newTweets)):
#
#         text = newTweets[tweet].text
#         ttid = newTweets[tweet].id_str
#
#         for word in containWords:
#             if word in text:
#                 filter = filterWords + "." + word
#                 print(newArray)
#                 db.users.update_one({"screen_name": user}, { "$push": { filter: ttid }})

# def setTweetsLength(newTweets):
#
#     newTweetsLen = len(newTweets)
#
#     return newTweetsLen
#
# def setFilteredTweetsJSON(user, friendId):
#     friendDict = db.users.find({"screen_name": user}, {twitter: 1})
#
#     tweetsJSON = {}
#
#     containObject = friendDict[0]["twitter"][friendId]["filter_words"]["contain"]
#
#     tweetsJSON = {
#         "filter_tweets" = containObject
#     }
#
#     return tweetsJSON

# def testv2():
#     ok = client.get_user_tweets()
#     print(ok)


def setTweetsJSON(newTweets):
    TweetsArray = []

    for i in range(len(newTweets)):
        TweetsArray.append(newTweets[i].id_str)

    newTweetsLen = len(newTweets)

    TweetsArray.reverse()

    TweetsJSON = {
        "new_tweet": newTweetsLen,
        "tweets_array": TweetsArray
    }

    print(TweetsArray)

    return TweetsJSON
