from keys import *
from spotlight.config import *

class follow_users(object):
    def __init__(self, id, name, screen_name,  profile_image_url):
        self.id = id,
        self.name = name,
        self.screen_name = screen_name,
        self.new_story = 0,
        self.profile_image_url = profile_image_url


following_list = {}

# UUID = api.generate_uuid()
#
# following_data = api.user_following(api.authenticated_user_id, rank_token=UUID)

following_data = api.user_info("4407026")

for i in range(len(following_data['user'])):
        _id = following_data['user']['pk']
        _name = following_data['user']['full_name']
        _screen_name = following_data['user']['username']
        _profile_image_url = following_data['user']['profile_pic_url']

        following_list.update({ 'ceciliamfurlan' : ""})

        new_user = follow_users(_id, _name, _screen_name, _profile_image_url)
        following_list.update({ 'ceciliamfurlan': new_user.__dict__ })

print(following_list)

for i in range(len(following_list)):
    str = list(following_list)[i]
    key = 'instagram.' + str
    values = list(following_list.values())[i]
    db.users.find_one_and_update({'screen_name': 'Deivede73'}, {'$set': { key: values}})
