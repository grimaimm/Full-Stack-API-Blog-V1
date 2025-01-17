from flask import jsonify, request
from config import db
from app.models.UserModel import UserModel
from app.models.CategoryModel import CategoryModel
from app.middleware.AuthRequired import check_access_level
from flask_jwt_extended import jwt_required, get_jwt_identity

# ==========================================================================================================
# API PRIVATE
# ==========================================================================================================


# Method POST - Membuat kategori baru (Level: Admin Only) /api/categories
@jwt_required()
def create_category():
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

    exiting_category = CategoryModel.query.filter_by(name=data["name"]).first()
    if exiting_category:
        return jsonify({"status": "error", "message": "Kategori sudah ada"}), 400

    last_category = CategoryModel.query.order_by(CategoryModel.id.desc()).first()
    new_id = 1 if not last_category else last_category.id + 1
    category = CategoryModel(id=new_id, name=data["name"])
    db.session.add(category)
    db.session.commit()

    return jsonify({"status": "success", "message": "Kategori berhasil dibuat"}), 201


# ==========================================================================================================
# API PUBLIC
# ==========================================================================================================


# Method GET - Mendapatkan semua kategori /api/categories
def get_categories():
    categories = CategoryModel.query.all()
    categories_list = []

    for category in categories:
        total_articles = len(category.articles)

        categories_list.append(
            {
                "id": category.id,
                "name": category.name,
                "total_articles": total_articles if total_articles else 0,
            }
        )

    return jsonify({"status": "success", "category_data": categories_list}), 200
