from werkzeug.security import generate_password_hash, check_password_hash
from config import db


class UserModel(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey("levels.id"), nullable=False)

    # Relasi dengan artikel dan comment
    articles = db.relationship("ArticleModel", backref="user", lazy=True)
    comments = db.relationship("CommentModel", backref="user", lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self, include_password=False):
        user_dict = {
            "id": self.id,
            "fullname": self.fullname,
            "email": self.email,
            "level_id": self.level_id,
            "level_name": self.level.name,
        }
        if include_password:
            user_dict["password"] = self.password

        return user_dict
