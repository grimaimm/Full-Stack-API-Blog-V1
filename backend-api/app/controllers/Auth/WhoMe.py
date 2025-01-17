# WhoMe.py
from flask import jsonify
from app.models.UserModel import UserModel
from flask_jwt_extended import jwt_required, get_jwt_identity


# Method GET - Who Me (Login Verified) /api/auth/who-me
@jwt_required()
def who_me():
    current_user_id = get_jwt_identity()
    user = UserModel.query.get(int(current_user_id))

    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    return (
        jsonify(
            {
                "status": "success",
                "message": "Login Verified",
                "user": user.to_dict(include_password=False),
            }
        ),
        200,
    )
