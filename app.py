from flask import Flask, render_template, request, jsonify, make_response, redirect
from src.twitter.get_status import getNewTweets, setTweetsJSON
from src.twitter.get_friends import setViewStatus, getTrueViewStatus, setFriendsArray
from src.instagram.get_friends import getTrueViewStatusInstagram, setUsersArray, setViewStatusInstagram
from src.instagram.get_status import getActiveStories, setStoriesJSON

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/config", methods=["GET"])
def config():
    friends = getTrueViewStatus("deivede")
    return render_template('config.html', friends=friends)

@app.route("/config/instagram", methods=["GET"])
def configInsta():
    users = getTrueViewStatusInstagram("deivede")
    return render_template('config_instagram.html', users=users)

@app.route("/config", methods=["POST"])
def form():
    formReq = request.form.to_dict()
    for id in formReq:
        setViewStatus("deivede", id)

    friends = getTrueViewStatus("deivede")
    return redirect("/config")

@app.route("/config/instagram", methods=["POST"])
def formInsta():
    formReq = request.form.to_dict()
    for id in formReq:
        setViewStatusInstagram("deivede", id)

    users = getTrueViewStatusInstagram("deivede")
    return redirect("/config/instagram")

@app.route("/twitter", methods=["POST"])
def update():

    rawID = request.data
    friendId = rawID.decode("utf-8")

    tweetsAPI = getNewTweets("deivede", friendId)
    tweetsJSON = setTweetsJSON(tweetsAPI)

    responseJSON = make_response(jsonify({"new_tweet": tweetsJSON["new_tweet"],
                                         "tweets_array": tweetsJSON["tweets_array"]}), 200)

    return responseJSON

@app.route("/twitterfriends", methods=["GET"])
def data():

    trueUsers = getTrueViewStatus("deivede")
    groupUsers = setFriendsArray(trueUsers)

    responseJSON = make_response(jsonify({"friendsArray": groupUsers}), 200)
    print(responseJSON)
    return responseJSON

@app.route("/instagram", methods=["POST"])
def updateInstagram():
    rawID = request.data
    userId = rawID.decode("utf-8")

    storiesAPI = getActiveStories(userId)
    storiesJSON = setStoriesJSON(storiesAPI)

    responseJSON = make_response(jsonify({"new_storie": storiesJSON["new_stories"],
                                            "last_reel": storiesJSON["last_reel"] }), 200)

    return responseJSON


@app.route("/instagramusers", methods=["GET"])
def dataInstagram():

    trueUsers = getTrueViewStatusInstagram("deivede")
    groupUsers = setUsersArray(trueUsers)

    responseJSON = make_response(jsonify({"usersArray": groupUsers}), 200)

    return responseJSON


if __name__ == "__main__":
    app.run(debug=True)
