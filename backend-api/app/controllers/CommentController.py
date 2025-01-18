from flask import jsonify, request
from config import db
from app.models.CategoryModel import CategoryModel
from app.models.ArticleModel import ArticleModel
from app.models.CommentModel import CommentModel
from app.models.UserModel import UserModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.middleware.AuthRequired import check_access_level


# ==========================================================================================================
# API PRIVATE
# ==========================================================================================================


# Method POST - Menambahkan komentar pada artikel tertentu /api/articles/{article_id}/comments
@jwt_required()
def add_comment_to_article(article_id):
    # Cek Level Akses
    access_error = check_access_level(["Author", "Reader"])
    if access_error:
        return access_error

    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()

    data = request.get_json()

    # Validasi Field
    required_fields = ["content"]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify({"status": "error", "message": "Field tidak boleh kosong"}),
                400,
            )

    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    # Cek ketersediaan artikel berdasarkan ID
    article = ArticleModel.query.get(article_id)
    if not article:
        return jsonify({"status": "error", "message": "Artikel tidak ditemukan"}), 404

    last_comment = (
        CommentModel.query.filter_by(article_id=article.id)
        .order_by(CommentModel.id.desc())
        .first()
    )
    new_id = 1 if not last_comment else last_comment.id + 1

    comment = CommentModel(
        id=new_id, content=data["content"], article_id=article.id, user_id=user.id
    )
    db.session.add(comment)
    db.session.commit()

    return (
        jsonify({"status": "success", "message": "Komentar berhasil ditambahkan"}),
        201,
    )


# Method GET - Mendapatkan semua komentar user tertentu /api/users/comments
@jwt_required()
def get_comments_for_user():
    # Cek Level Akses
    access_error = check_access_level(["Author", "Reader"])
    if access_error:
        return access_error
    
    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()
    
    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    comments = CommentModel.query.filter_by(user_id=user_id).all()
    results = []

    for comment in comments:
        article = ArticleModel.query.filter_by(id=comment.article_id).first()
        result = {
            "id": comment.id,
            "content": comment.content,
            "created_at": comment.created_at,
            "article_id": comment.article_id,
            "article_title": article.title,
        }

        results.append(result)

    return jsonify({"status": "success", "comments_data": results}), 200


# Method DELETE - Menghapus komentar (Level: Admin & Author) /api/comments/:id
@jwt_required()
def delete_comment(comment_id):
    # Cek Level Akses
    access_error = check_access_level(["Admin", "Author"])
    if access_error:
        return access_error

    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()

    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404
    
    comment = CommentModel.query.get(comment_id)
    if not comment:
        return jsonify({"status": "error", "message": "Komentar tidak ditemukan"}), 404

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"status": "success", "message": "Komentar berhasil dihapus"}), 200



# ==========================================================================================================
# API PUBLIC
# ==========================================================================================================


# Method GET - Mendapatkan semua komentar pada artikel tertentu /api/articles/{article_id}/comments
def get_comments_for_article(article_id):
    comments = CommentModel.query.filter_by(article_id=article_id).all()
    results = []

    for comment in comments:
        user = UserModel.query.filter_by(id=comment.user_id).first()
        result = {
            "id": comment.id,
            "content": comment.content,
            "created_at": comment.created_at,
            "user_id": comment.user_id,
            "user_fullname": user.fullname,
        }

        results.append(result)

    return jsonify({"status": "success", "comments_data": results}), 200


