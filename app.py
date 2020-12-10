from flask import Flask, render_template, request, jsonify, make_response, redirect
from src.twitter.get_status import getNewTweets, setTweetsJSON
from src.twitter.get_friends import setViewStatus, getTrueViewStatus, setFriendsArray
# from src.instagram.get_friends import getusr_ig
# from src.instagram.get_status import take_stry

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

@app.route("/", methods=["POST"])
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

    trueFriends = getTrueViewStatus("deivede")
    groupFriends = setFriendsArray(trueFriends)

    responseJSON = make_response(jsonify({"friendsArray": groupFriends}), 200)

    print(groupFriends)

    return responseJSON

# @app.route("/ig", methods=["POST"])
# def ig():
#
#     req = request.data
#
#     print(req)
#
#     usr_res = req.decode("utf-8")
#
#     restry = take_stry(usr_res)
#
#     res = make_response(jsonify({"stry": restry["new_stry"]}), 200)
#
#     return res
#
# @app.route("/dbusr_ig", methods=["GET"])
# def usr_ig():
#
#
#     ret_ig = getusr_ig()
#
#     resp = make_response(jsonify({"usr_ig": ret_ig}), 200)
#
#     print(resp)
#
#     return resp


if __name__ == "__main__":
    app.run(debug=True)
