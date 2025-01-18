import re
from flask import jsonify, request
from config import db
from app.models.LevelModel import LevelModel
from app.models.UserModel import UserModel
from app.utils.PasswordValidation import ValidateUserPassword
from app.middleware.AuthRequired import check_access_level
from flask_jwt_extended import jwt_required, get_jwt_identity


# Method POST - Create a new user /api/users
@jwt_required()
def create_user():
    # Cek Level Akses
    access_error = check_access_level(["Admin"])
    if access_error:
        return access_error

    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()

    data = request.get_json()

    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    # Validasi Field
    required_fields = ["fullname", "email", "password", "level_id"]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Harap isi semua field",
                    }
                ),
                400,
            )

    data = request.get_json()

    # Validasi Fullname hanya boleh menggunakan huruf
    fullname = data.get("fullname", "")
    if not re.match(r"^[a-zA-Z\s]+$", fullname):
        return (
            jsonify(
                {"status": "error", "message": "Fullname hanya boleh berisi huruf"}
            ),
            400,
        )

    # Validasi Format Email
    email = data.get("email", "")
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"status": "error", "message": "Format email tidak valid"}), 400

    # Validasi Level
    level = LevelModel.query.get(data["level_id"])
    if not level:
        return jsonify({"status": "error", "message": "Level tidak ditemukan"}), 400

    # Validasi Password
    password = data.get("password", "")
    validation = ValidateUserPassword(password)
    if validation:
        return jsonify({"status": "error", "message": validation}), 400

    # Cek ketersediaan user berdasarkan email
    exiting_user = UserModel.query.filter_by(email=data["email"]).first()
    if exiting_user:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Email sudah digunakan, silahkan gunakan email lain",
                }
            ),
            400,
        )

    # Generate ID
    last_user = UserModel.query.order_by(UserModel.id.desc()).first()
    new_id = 1 if last_user is None else last_user.id + 1
    user = UserModel(
        id=new_id,
        fullname=fullname,
        email=email,
        level_id=level.id,
    )

    # Set Password
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return (
        jsonify(
            {
                "status": "success",
                "message": "User berhasil dibuat",
                "data": user.to_dict(),
            }
        ),
        201,
    )


# Method GET - Get all users /api/users
@jwt_required()
def get_all_users():
    # Cek Level Akses
    access_error = check_access_level(["Admin"])
    if access_error:
        return access_error

    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()

    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    users = UserModel.query.all()
    results = []

    for user in users:
        level = LevelModel.query.filter_by(id=user.level_id).first()
        result = {
            "id": user.id,
            "fullname": user.fullname,
            "email": user.email,
            "level_id": user.level_id,
            "level_name": level.name,
        }

        results.append(result)

    return jsonify({"status": "success", "data": results}), 200


# Method GET - Get user by id /api/users/:id
# @jwt_required()
# def get_user_by_id(user_id):
#     user = UserModel.query.get(user_id)
#     if not user:
#         return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

#     level = LevelModel.query.filter_by(id=user.level_id).first()
#     result = {
#         "id": user.id,
#         "fullname": user.fullname,
#         "email": user.email,
#         "level_id": user.level_id,
#         "level_name": level.name,
#     }

#     return jsonify({"status": "success", "data": result}), 200


# Method PUT - Update user by id /api/users/:id
@jwt_required()
def update_user(user_id):
    # Cek Level Akses
    access_error = check_access_level(["Admin"])
    if access_error:
        return access_error

    # Ambil data dari request
    data = request.get_json()

    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    # Validasi Field
    required_fields = ["fullname", "email", "password", "level_id"]
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": f"Field berikut wajib diisi: {', '.join(missing_fields)}",
                }
            ),
            400,
        )

    # Validasi Fullname hanya boleh menggunakan huruf
    fullname = data["fullname"]
    if not re.match(r"^[a-zA-Z\s]+$", fullname):
        return (
            jsonify(
                {"status": "error", "message": "Fullname hanya boleh berisi huruf"}
            ),
            400,
        )

    # Validasi Format Email
    email = data["email"]
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"status": "error", "message": "Format email tidak valid"}), 400

    # Cek apakah email sudah digunakan oleh user lain
    if email != user.email:
        existing_user = UserModel.query.filter_by(email=email).first()
        if existing_user:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Email sudah digunakan, silahkan gunakan email lain",
                    }
                ),
                400,
            )

    # Validasi Password
    password = data["password"]
    validation = ValidateUserPassword(password)
    if validation:
        return jsonify({"status": "error", "message": validation}), 400

    # Validasi Level
    level_id = data["level_id"]
    level = LevelModel.query.get(level_id)
    if not level:
        return jsonify({"status": "error", "message": "Level tidak ditemukan"}), 400

    # Update user
    user.fullname = fullname
    user.email = email
    user.level_id = level_id

    # Set Password
    user.set_password(password)

    # Simpan perubahan
    db.session.commit()

    return (
        jsonify(
            {
                "status": "success",
                "message": "User berhasil diperbarui",
                "data": user.to_dict(),
            }
        ),
        200,
    )


# Method PATCH - Update user by id /api/users/:id
# @jwt_required()
# def partial_update_user(user_id):
#     data = request.get_json()

#     # Cari user berdasarkan ID
#     user = UserModel.query.get(user_id)
#     if not user:
#         return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

#     # Validasi Fullname hanya boleh menggunakan huruf (jika ada)
#     fullname = data.get("fullname")
#     if fullname and not re.match(r"^[a-zA-Z\s]+$", fullname):
#         return (
#             jsonify(
#                 {"status": "error", "message": "Fullname hanya boleh berisi huruf"}
#             ),
#             400,
#         )

#     # Validasi Format Email (jika ada)
#     email = data.get("email")
#     if email and not re.match(r"[^@]+@[^@]+\.[^@]+", email):
#         return jsonify({"status": "error", "message": "Format email tidak valid"}), 400

#     # Validasi Level (jika ada)
#     level_id = data.get("level_id")
#     if level_id:
#         level = LevelModel.query.get(level_id)
#         if not level:
#             return jsonify({"status": "error", "message": "Level tidak ditemukan"}), 400
#         user.level_id = level.id

#     # Update hanya field yang ada dalam data
#     if fullname:
#         user.fullname = fullname
#     if email:
#         # Cek ketersediaan user dengan email baru
#         existing_user = UserModel.query.filter(
#             UserModel.email == email, UserModel.id != user_id
#         ).first()
#         if existing_user:
#             return (
#                 jsonify(
#                     {
#                         "status": "error",
#                         "message": "Email sudah digunakan oleh pengguna lain",
#                     }
#                 ),
#                 400,
#             )
#         user.email = email

#     db.session.commit()

#     return (
#         jsonify(
#             {
#                 "status": "success",
#                 "message": "User berhasil diperbarui",
#                 "data": user.to_dict(),
#             }
#         ),
#         200,
#     )


# Method DELETE - Delete user by id /api/users/:id
@jwt_required()
def delete_user(user_id):
    # Cek Level Akses
    access_error = check_access_level(["Admin"])
    if access_error:
        return access_error

    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()

    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"status": "success", "message": "User berhasil dihapus"}), 200
