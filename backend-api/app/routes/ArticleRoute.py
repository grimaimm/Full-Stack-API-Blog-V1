from flask import blueprints
from app.controllers.ArticleController import *

ArticleRoute = blueprints.Blueprint("ArticleRoute", __name__)

# PRIVATE ROUTE
ArticleRoute.route("/api/private/articles", methods=["POST"])(create_article)
ArticleRoute.route("/api/private/articles", methods=["GET"])(get_all_articles_by_user)
ArticleRoute.route("/api/private/articles/<int:article_id>", methods=["PUT"])(update_article_by_id_and_user_id)
ArticleRoute.route("/api/private/articles/<int:article_id>", methods=["DELETE"])(delete_article_by_id_and_user_id)

# PUBLIC ROUTE
ArticleRoute.route("/api/public/articles", methods=["GET"])(get_all_articles)
ArticleRoute.route("/api/public/articles/<int:article_id>", methods=["GET"])(get_article_by_id)
ArticleRoute.route("/api/public/categories/<int:category_id>/articles", methods=["GET"])(get_articles_by_category)
