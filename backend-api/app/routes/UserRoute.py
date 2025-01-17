from flask import Blueprint
from app.controllers.UserController import *

UserRoute = Blueprint("UserRoute", __name__)

UserRoute.route("/api/users", methods=["POST"])(create_user)
UserRoute.route("/api/users", methods=["GET"])(get_all_users)
UserRoute.route("/api/users/<int:user_id>", methods=["PUT"])(update_user)
UserRoute.route("/api/users/<int:user_id>", methods=["DELETE"])(delete_user)
