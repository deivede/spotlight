from flask import Flask, render_template, request, jsonify, make_response, redirect
from src.twitter.get_status import getNewTweets, setTweetsJSON
from src.twitter.get_friends import setViewStatus, getTrueViewStatus, setFriendsArray

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/config", methods=["GET"])
def config():
    friends = getTrueViewStatus("deivede")
    return render_template('config.html', friends=friends)

@app.route("/config", methods=["POST"])
def form():
    formReq = request.form.to_dict()
    for id in formReq:
        setViewStatus("deivede", id)

    friends = getTrueViewStatus("deivede")
    return redirect("/config")

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

@app.route("/updatepics", methods=["GET"])
def pics():

    updateProfileImage("deivede")

    return 200



if __name__ == "__main__":
    app.run(debug=True)
