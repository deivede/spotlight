from instagram_private_api import Client, ClientCompatPatch
import os

user_name = os.environ['igusername']
password = os.environ['igpassword']

api = Client(user_name, password)
