from config import *


class friend_obj(object):
    def __init__(self, pic, id, link, nwtt):
        self.pic = pic
        self.id = id
        self.link = link
        self.nwtt = nwtt

class account_obj(object):
    def __init__(self, pic, id, link):
        self.pic = pic
        self.id = id
        self.link = link


dbusr_ig = {}

def get_home_accounts(account):

        instagram = "instagram."

        ig_conct = instagram + account

        user = db.users.find({"screen_name": "Deivede73"}, {ig_conct: 1})

        _pic = user[0]["instagram"][account]["profile_image_url"],
        _id = user[0]["instagram"][account]["screen_name"][0],
        _link = "http://instagram.com/stories/" + user[0]["instagram"][account]["screen_name"][0],

        add_account = account_obj(_pic, _id, _link)

        dbusr_ig.update({account: add_account.__dict__})

get_home_accounts("rique_cardoso_")
get_home_accounts("kainalacerda")
get_home_accounts("werneck_tati")
get_home_accounts("ca_momille")
get_home_accounts("nath_ayres")
get_home_accounts("larissesposito")
get_home_accounts("cecihadassa")
get_home_accounts("tainasoaresc")
get_home_accounts("brunarochaamorim")
get_home_accounts("bacanna_tattoo")
get_home_accounts("_aninhamr_")
get_home_accounts("anna_bacanna")
get_home_accounts("hiimf")
get_home_accounts("celadeoliveira")
get_home_accounts("juu_lunardi")
get_home_accounts("lucollyer")
get_home_accounts("saraecheagaray")
get_home_accounts("ceelaribeiro")
get_home_accounts("niccsz")
get_home_accounts("deborasecoalmeida")
get_home_accounts("willthetraveler")
get_home_accounts("aninha_sousa27")
get_home_accounts("fernandasaffi")
get_home_accounts("ofamosopachecao")
# get_home_accounts("ceciliamfurlan")
get_home_accounts("gabemelos")
get_home_accounts("ruliadantas")
# get_home_accounts("marinavascart")
get_home_accounts("bbr_oliveira")
# get_home_accounts("referreiratiff")
get_home_accounts("rliaju")
get_home_accounts("_soytha")


def getusr_ig():
    return dbusr_ig
