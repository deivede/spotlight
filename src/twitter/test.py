import unittest
from add_friend import *
from config import *
from get_friends import *

ff = {}
aa = type(ff)
yt = []
hh = type(yt)

class testDBandAPI(unittest.TestCase):
    def test_add(self):
        apicall = getFriends("11113512", 2)
        typecheck = type(apicall.__dict__)
        self.assertEqual(typecheck, aa)

    def test_status(self):
        apicall = getTrueViewStatus("deivede")
        ad = setFriendsArray(apicall)
        typecheck = type(ad)
        self.assertEqual(typecheck, hh)









if __name__ == '__main__':
    unittest.main()
