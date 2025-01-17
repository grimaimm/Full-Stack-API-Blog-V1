from flask import Blueprint
from app.controllers.Auth.RegisterController import *
from app.controllers.Auth.LoginController import *
from app.controllers.Auth.WhoMe import *

AuthRoute = Blueprint("AuthRoute", __name__)

AuthRoute.route("/api/auth/login", methods=["POST"])(login_user)
AuthRoute.route("/api/auth/who-me", methods=["GET"])(who_me)

AuthRoute.route("/api/auth/register/author", methods=["POST"])(register_author)
AuthRoute.route("/api/auth/register/reader", methods=["POST"])(register_reader)
