from config import db


class LevelModel(db.Model):
    __tablename__ = "levels"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    # Relationships with User
    users = db.relationship("UserModel", backref="level", lazy=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name}
