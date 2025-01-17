from config import db


class CategoryModel(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    articles = db.relationship("ArticleModel", backref="category", lazy=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name}
