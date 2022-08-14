from flask import Flask, render_template, request, jsonify, make_response, redirect, url_for, flash
from flask_login import login_required, logout_user, current_user
from src.twitter.get_status import getNewTweets, setTweetsJSON, getOldTweets, setOldTweetsJSON
from src.twitter.get_friends import setViewStatus, getTrueViewStatus, setFriendsArray
from src.twitter.update_friend import updateProfileImage
from src.twitter.add_friend import getFriends, setFriendsDict, pushFriendsToDB, addUser, searchUsers, addFriendToDB
from src.twitter.cli import create_db
from src.twitter.dbconfig import Config
from models import db, login_manager
from src.twitter.oauth import blueprint
from src.twitter.heroku_config import db as mongodb


app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(blueprint, url_prefix="/login")
app.cli.add_command(create_db)
db.init_app(app)
login_manager.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route("/home")
def home():
    return render_template('index.html')

@app.route("/")
def login():
    return render_template('login.html')

@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have logged out")
    return redirect(url_for("login"))


@app.route("/config", methods=["GET"])
def config():
    try:
        friends = getTrueViewStatus(current_user.name)
        return render_template('config.html', friends=friends)
    except:
        return redirect(url_for("adduser"))

@app.route("/config", methods=["POST"])
def form():
    formReq = request.form.to_dict()
    for id in formReq:
        setViewStatus(current_user.name, id)

    friends = getTrueViewStatus(current_user.name)
    return redirect("/config")

@app.route("/twitter", methods=["POST"])
def update():

    rawID = request.data
    friendId = rawID.decode("utf-8")

    tweetsAPI = getNewTweets(current_user.name, friendId)
    tweetsJSON = setTweetsJSON(tweetsAPI)

    responseJSON = make_response(jsonify({"new_tweet": tweetsJSON["new_tweet"],
                                         "tweets_array": tweetsJSON["tweets_array"]}), 200)

    return responseJSON

@app.route("/oldtweets", methods=["POST"])
def old():

    rawID = request.data
    friendId = rawID.decode("utf-8")

    oldTweetsJSON = getOldTweets(current_user.name, friendId)
    tweetsJSON = setOldTweetsJSON(oldTweetsJSON)

    responseJSON = make_response(jsonify({"old_tweets": tweetsJSON["old_tweets"]}), 200)

    return responseJSON

@app.route("/twitterfriends", methods=["GET"])
def data():

    trueUsers = getTrueViewStatus(current_user.name)
    groupUsers = setFriendsArray(trueUsers)

    responseJSON = make_response(jsonify({"friendsArray": groupUsers}), 200)
    print(responseJSON)
    return responseJSON

@app.route("/adduser", methods=["GET"])
@login_required
def adduser():
    addUser(current_user.name)
    return redirect(url_for("config"))

@app.route("/addfriends", methods=["GET"])
def add():

    friendsData = getFriends(current_user.name)
    friendsList = setFriendsDict(friendsData)

    pushFriendsToDB(friendsList, current_user.name)

    return redirect(url_for("config"))

@app.route("/updatepics", methods=["GET"])
def pics():

    updateProfileImage(current_user.name)

    return redirect(url_for("config"))

@app.route("/usersearch", methods=["POST"])
def search():
    formReq = request.form.get('username')

    users = searchUsers(formReq)
    return render_template('usersearch.html', users=users)

@app.route("/addfriend", methods=["POST"])
def friend():
    formReq = request.form.get('friend')

    addFriendToDB(formReq, current_user.name)
    return redirect(url_for("config"))

if __name__ == "__main__":
    app.run(debug=True)
