from flask import Blueprint
from app.controllers.LevelController import *
LevelRoute = Blueprint("LevelRoute", __name__)

LevelRoute.route("/api/levels", methods=["POST"])(create_level)
LevelRoute.route("/api/levels", methods=["GET"])(get_all_levels)
