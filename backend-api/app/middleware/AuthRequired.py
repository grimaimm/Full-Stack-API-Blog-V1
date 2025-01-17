# AuthRequired.py

from flask import jsonify
from app.models.UserModel import UserModel
from flask_jwt_extended import get_jwt_identity


def check_access_level(required_level):
    """
    Middleware untuk memeriksa apakah level pengguna berada pada level yang diperlukan.
    """

    current_user_id = get_jwt_identity()
    user = UserModel.query.get(current_user_id)

    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    if user.level.name not in required_level:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Akses ditolak, Anda harus memiliki level yang sesuai",
                }
            ),
            403,
        )

    return None
