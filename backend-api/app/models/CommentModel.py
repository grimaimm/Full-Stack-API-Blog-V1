from config import db
from datetime import datetime


class CommentModel(db.Model):
    __tablename__ = "comments"
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_at": self.created_at,
            "article_id": self.article_id,
            "user_id": self.user_id,
        }
