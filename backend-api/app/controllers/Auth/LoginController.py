# LoginController.py

from flask import jsonify, request
from app.models.UserModel import UserModel
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta
import re


# Fungsi membuat Access Token
def generate_access_token(user_id):
    access_token = create_access_token(
        # identity=user_id, expires_delta=timedelta(minutes=2)
        identity=user_id, expires_delta=timedelta(days=1)
    )
    return access_token


# Method POST - Login user /api/auth/login
def login_user():
    data = request.get_json()

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    # Validasi Input Email dan Password
    if not email or not password:
        return (
            jsonify({"status": "error", "message": "Email dan password harus diisi"}),
            400,
        )

    # Cek format email
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"status": "error", "message": "Format email tidak valid"}), 400

    # Cek user berdasarkan email
    user = UserModel.query.filter_by(email=email).first()
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    # Cek password
    if user and check_password_hash(user.password, password):
        
        # Generate access token
        access_token = generate_access_token(str(user.id))

        # Response
        response = jsonify(
            {
                "status": "success",
                "message": "Login berhasil",
                "access_token": access_token,
                "user_level": user.level_id
                # "user": user.to_dict(include_password=False),
            }
        )

        return response, 200

    return jsonify({"status": "error", "message": "Email atau password salah"}), 401
