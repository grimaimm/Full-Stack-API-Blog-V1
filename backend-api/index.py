from flask import render_template
from config import app, db
from app.routes.AuthRoute import AuthRoute
from app.routes.LevelRoute import LevelRoute
from app.routes.UserRoute import UserRoute
from app.routes.ArticleRoute import ArticleRoute
from app.routes.CategoryRoute import CategoryRoute
from app.routes.CommentRoute import CommentRoute

app.register_blueprint(AuthRoute)
app.register_blueprint(LevelRoute)
app.register_blueprint(UserRoute)
app.register_blueprint(ArticleRoute)
app.register_blueprint(CategoryRoute)
app.register_blueprint(CommentRoute)

@app.route("/")
def index():
    return render_template("index.html")
