import tweepy
from src.twitter.heroku_keys import *
from src.twitter.heroku_config import *
# from src.twitter.keys import *
# from src.twitter.config import *
# from keys import *

def getOldTweets(user, friendId):
    twitter = "twitter." + friendId
    friendDict = db.users.find({"screen_name": user}, {twitter: 1})
    tweetStorage = friendDict[0]["twitter"][friendId]["last_call_tweets"]

    oldTweets = [[""]]

    if tweetStorage:
        oldTweets = tweetStorage

    oldTweetsArray = []

    for i in range(len(oldTweets)):
                oldTweetsArray.append({"tweetId": oldTweets[i],
                                    "linkedTweet": ""})

    return oldTweetsArray

def getNewTweets(user, friendId):

    twitter = "twitter." + friendId
    friendLastTweet = twitter + ".last_tweet.0"
    LastTweets = twitter + ".last_call_tweets"


    friendDict = db.users.find({"screen_name": user}, {twitter: 1})

    lastTweet = friendDict[0]["twitter"][friendId]["last_tweet"][0]
    id = friendDict[0]["twitter"][friendId]["id"][0]

    newTweets = []
    oldTweets = []

    newTweets = api.user_timeline(since_id=lastTweet, user_id=id)
    oldTweets = api.user_timeline(user_id=id, exclude_replies="true")

    if newTweets:
        for i in range(len(newTweets)):
            if newTweets[i].in_reply_to_user_id_str == newTweets[0].user.id_str or newTweets[i].in_reply_to_user_id_str is None:
                newLastTweet = newTweets[i].id
                db.users.update_one({"screen_name": user}, { "$set": { friendLastTweet: newLastTweet }})
                break

    LastCallTweets = []

    for i in range(len(oldTweets)):
        LastCallTweets.append(oldTweets[i].id_str)

    db.users.update_one({"screen_name": user}, { "$set": { LastTweets: LastCallTweets }})

    return newTweets

def setOldTweetsJSON(oldTweets):

    oldTweetsJSON = {
        "old_tweets": oldTweets
    }

    return oldTweetsJSON

def setTweetsJSON(newTweets):
    TweetsArray = []

    for i in range(len(newTweets)):
        if newTweets[i].in_reply_to_user_id_str == newTweets[0].user.id_str or newTweets[i].in_reply_to_user_id_str is None:
            if newTweets[i].is_quote_status is True:
                TweetsArray.append({"tweetId": newTweets[i].id_str,
                                    "linkedTweet": newTweets[i].quoted_status_id_str})
            else:
                TweetsArray.append({"tweetId": newTweets[i].id_str,
                                    "linkedTweet": ""})

    newTweetsLen = len(TweetsArray)

    TweetsJSON = {
        "new_tweet": newTweetsLen,
        "tweets_array": TweetsArray,
    }

    print(TweetsArray)

    return TweetsJSON
