from flask import Flask, render_template, request, jsonify, make_response, redirect, url_for
from src.twitter.get_status import getNewTweets, setTweetsJSON
from src.twitter.get_friends import setViewStatus, getTrueViewStatus, setFriendsArray
from src.twitter.keys import *
from src.twitter.config import *
from src.twitter.add_friend import *
from flask_dance.contrib.twitter import make_twitter_blueprint, twitter
import os

flaskkey = os.urandom(24)

app = Flask(__name__)
app.secret_key = flaskkey
app.config["TWITTER_OAUTH_CLIENT_KEY"] = oauthkey
app.config["TWITTER_OAUTH_CLIENT_SECRET"] = oauthskey
twitter_bp = make_twitter_blueprint()
app.register_blueprint(twitter_bp, url_prefix="/login")


@app.route("/")
def index():
    if not twitter.authorized:
        return redirect("/login")

    return render_template('index.html')

@app.route("/login")
def login():

    return render_template('login.html')

@app.route("/signin")
def signin():
    resp = twitter.get("account/verify_credentials.json")
    assert resp.ok
    userId = resp.json()["screen_name"]

    setDBdocument(userId)
    userFriends = getFriends(userId)
    friendsDict = setFriendsDict(userFriends)
    pushFriendsToDB(userId, friendsDict)

    render_template('confirmation.html')

@app.route("/config", methods=["GET"])
def config():
    resp = twitter.get("account/verify_credentials.json")
    assert resp.ok
    userId = resp.json()["screen_name"]

    friends = getTrueViewStatus(userId)
    return render_template('config.html', friends=friends)

@app.route("/config", methods=["POST"])
def form():
    resp = twitter.get("account/verify_credentials.json")
    assert resp.ok
    userId = resp.json()["screen_name"]
    print(userId)

    formReq = request.form.to_dict()
    for id in formReq:
        setViewStatus(userId, id)

    friends = getTrueViewStatus(userId)
    return redirect("/config")

@app.route("/twitter", methods=["POST"])
def update():
    resp = twitter.get("account/verify_credentials.json")
    assert resp.ok
    userId = resp.json()["screen_name"]
    print(userId)

    rawID = request.data
    friendId = rawID.decode("utf-8")

    tweetsAPI = getNewTweets(userId, friendId)
    tweetsJSON = setTweetsJSON(tweetsAPI)

    responseJSON = make_response(jsonify({"new_tweet": tweetsJSON["new_tweet"],
                                         "tweets_array": tweetsJSON["tweets_array"]}), 200)

    return responseJSON

@app.route("/twitterfriends", methods=["GET"])
def data():
    resp = twitter.get("account/verify_credentials.json")
    userId = resp.json()["screen_name"]
    print(userId)

    trueUsers = getTrueViewStatus(userId)
    groupUsers = setFriendsArray(trueUsers)

    responseJSON = make_response(jsonify({"friendsArray": groupUsers}), 200)
    print(responseJSON)
    return responseJSON



if __name__ == "__main__":
    app.run(debug=True)
