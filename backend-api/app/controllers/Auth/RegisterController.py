from flask import jsonify, request
from config import db
from app.models.UserModel import UserModel
from app.models.LevelModel import LevelModel
from app.utils.PasswordValidation import ValidateUserPassword
from flask_jwt_extended import jwt_required
from werkzeug.security import check_password_hash
from datetime import timedelta
import re


def register_user(level_id):
    data = request.get_json()

    required_fields = ["fullname", "email", "password"]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify({"status": "error", "message": f"{field.capitalize()} tidak boleh kosong"}),
                400,
            )

    fullname = data.get("fullname", "")
    email = data.get("email", "")
    password = data.get("password", "")

    if not re.match(r"^[a-zA-Z\s]+$", fullname):
        return jsonify({"status": "error", "message": "Fullname hanya boleh berisi huruf"}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"status": "error", "message": "Format email tidak valid"}), 400

    validation = ValidateUserPassword(password)
    if validation:
        return jsonify({"status": "error", "message": validation}), 400

    if UserModel.query.filter_by(email=email).first():
        return jsonify({"status": "error", "message": "Email sudah digunakan"}), 400

    last_user = UserModel.query.order_by(UserModel.id.desc()).first()
    new_id = 1 if not last_user else last_user.id + 1
    user = UserModel(
        id=new_id,
        fullname=fullname,
        email=email,
        level_id=level_id,
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "User berhasil dibuat",
        "data": user.to_dict(),
    }), 201


# Method POST - Register User untuk Level Author /api/auth/register/author
def register_author():
    return register_user(level_id=2)

# Method POST - Register User untuk Level Reader /api/auth/register/reader
def register_reader():
    return register_user(level_id=3)
