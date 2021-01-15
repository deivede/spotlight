from instagram_private_api import Client, ClientCompatPatch

user_name = os.environ['igusername']
password = os.environ['igpassword']

api = Client(user_name, password)
