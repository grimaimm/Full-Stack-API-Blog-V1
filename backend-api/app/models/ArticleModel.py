import re
from config import db
from datetime import datetime


class ArticleModel(db.Model):
  __tablename__ = "articles"
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(100), nullable=False)
  content = db.Column(db.Text, nullable=False)
  status = db.Column(db.Boolean, default=False)
  total_views = db.Column(db.Integer, default=0)
  created_at = db.Column(db.DateTime, default=datetime.utcnow)
  updated_at = db.Column(db.DateTime, default=datetime.utcnow)
  
  category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

  comments = db.relationship("CommentModel", backref="article", lazy=True)

  def to_dict(self):
    return {
      "id": self.id,
      "title": self.title,
      "content": self.content,
      "status": self.status,
      "total_views": self.total_views,
      "created_at": self.created_at,
      "category_id": self.category_id,
      "user_id": self.user_id,
    }
    