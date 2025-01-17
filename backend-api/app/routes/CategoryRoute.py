from flask import blueprints
from app.controllers.CategoryController import *

CategoryRoute = blueprints.Blueprint("CategoryRoute", __name__)

CategoryRoute.route("/api/categories", methods=["POST"])(create_category)
CategoryRoute.route("/api/categories", methods=["GET"])(get_categories)