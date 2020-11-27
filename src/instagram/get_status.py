from src.instagram.keys import api
from config import db

def take_stry(account):

    instagram = "instagram."

    ig_conct = instagram + account

    user = db.users.find({"screen_name": "Deivede73"}, {ig_conct: 1})

    last_stry = user[0]["instagram"][account]["last_story"][0]

    id_account = user[0]["instagram"][account]["id"][0]

    new_stry = api.user_story_feed(id_account)

    stry_items = new_stry["reel"]["items"]

    active_stry = len(stry_items)
    #
    # db_conct =  ig_conct + ".new_story.0"
    #
    # db.users.update_one({"screen_name": "Deivede73"}, { "$set": { db_conct: active_stry }})

    new_stry_json = {
        "new_stry": active_stry
    }

    return new_stry_json
