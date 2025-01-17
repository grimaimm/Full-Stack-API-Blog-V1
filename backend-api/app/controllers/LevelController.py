from flask import jsonify, request
from config import db
from app.models.UserModel import UserModel
from app.models.LevelModel import LevelModel
from app.middleware.AuthRequired import check_access_level
from flask_jwt_extended import jwt_required, get_jwt_identity

# Method POST - Create a new level /api/levels
@jwt_required()
def create_level():
    # Cek Akses Level
    access_error = check_access_level(["Admin"])
    if access_error:
        return access_error
    
    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()
    
    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404
    
    # Validasi Field
    required_fields = ["name"]
    for field in required_fields:
        if not request.json.get(field):
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

    exiting_level = LevelModel.query.filter_by(name=data["name"]).first()
    if exiting_level:
        return jsonify({"status": "error", "message": "Level sudah ada"}), 400

    level = LevelModel(name=data["name"])
    db.session.add(level)
    db.session.commit()

    return jsonify({"status": "success", "message": "Level berhasil dibuat"}), 201


# Method GET - Get all levels /api/levels
@jwt_required()
def get_all_levels():
    # Cek Akses Level
    access_error = check_access_level(["Admin"])
    if access_error:
        return access_error
    
    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()
    
    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404
    
    levels = LevelModel.query.all()
    return (
        jsonify({"status": "success", "data": [level.to_dict() for level in levels]}),
        200,
    )
