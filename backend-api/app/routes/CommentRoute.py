from flask import Blueprint
from app.controllers.CommentController import *

CommentRoute = Blueprint("CommentRoute", __name__)

CommentRoute.route("/api/articles/<int:article_id>/comments", methods=["GET"])(get_comments_for_article)
CommentRoute.route("/api/articles/<int:article_id>/comments", methods=["POST"])(add_comment_to_article)
CommentRoute.route("/api/users/comments", methods=["GET"])(get_comments_for_user)
CommentRoute.route("/api/comments/<int:comment_id>", methods=["DELETE"])(delete_comment)