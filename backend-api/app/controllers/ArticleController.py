from flask import jsonify, request
from config import db
from app.models.CategoryModel import CategoryModel
from app.models.ArticleModel import ArticleModel
from app.models.CommentModel import CommentModel
from app.models.UserModel import UserModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.middleware.AuthRequired import check_access_level


# ==========================================================================================================
# API PUBLIC
# ==========================================================================================================


# Method GET - Mendapatkan semua artikel (Level: Public) /api/public/articles
def get_all_articles():
    articles = ArticleModel.query.all()
    articles_list = []

    for article in articles:
        comments = CommentModel.query.filter_by(article_id=article.id).all()
        comment_count = len(comments)

        article_data = {
            "id": article.id,
            "title": article.title,
            "content": article.content,
            "total_views": article.total_views,
            "comment_count": comment_count,
            "created_at": article.created_at,
        }

        articles_list.append(article_data)

    return jsonify({"status": "success", "articles": articles_list}), 200


# Method GET - Mendapatkan artikel berdasarkan kategori /api/public/categories/<int:category_id>/articles
def get_articles_by_category(category_id):
    # Cari kategori berdasarkan ID
    category = CategoryModel.query.filter_by(id=category_id).first()

    if not category:
        return jsonify({"status": "error", "message": "Category not found"}), 404

    # Ambil artikel berdasarkan kategori
    articles = ArticleModel.query.filter_by(category_id=category.id).all()
    articles_list = []

    for article in articles:
        comments = CommentModel.query.filter_by(article_id=article.id).all()
        comment_count = len(comments)

        article_data = {
            "id": article.id,
            "title": article.title,
            "content": article.content,
            "total_views": article.total_views,
            "comment_count": comment_count,
            "created_at": article.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }

        articles_list.append(article_data)

    return (
        jsonify(
            {
                "status": "success",
                "category": {"id": category.id, "name": category.name},
                "articles": articles_list,
            }
        ),
        200,
    )


import re


# Function to convert title to slug
def convert_to_slug(title):
    # Replace spaces with hyphens and convert to lowercase
    slug = re.sub(r"\s+", "-", title.lower())
    # Remove any non-alphanumeric characters except hyphens
    # slug = re.sub(r'[^a-z0-9-]', '', slug)
    return slug


# Method GET - Mendapatkan artikel berdasarkan judul (Level: Public) /api/public/articles/<string:title>
def get_article_by_title(slug):
    # Mengubah slug menjadi judul (kebalikan dari proses convert_to_slug)
    title = slug.replace("-", " ").title()

    # Cari artikel berdasarkan judul
    article = ArticleModel.query.filter_by(title=title).first()

    if article is None:
        return jsonify({"status": "error", "message": "Artikel tidak ditemukan"}), 404

    # Tambah 1 pada total_views setiap kali artikel diakses
    article.total_views += 1
    db.session.commit()

    comments = CommentModel.query.filter_by(article_id=article.id).all()
    comment_count = len(comments)

    article_data = {
        "id": article.id,
        "title": article.title,
        "content": article.content,
        "total_views": article.total_views,
        "comment_count": comment_count,
        "created_at": article.created_at,
        "category_id": article.category_id,
        "category_name": article.category.name,
        "user_id": article.user_id,
        "user_fullname": article.user.fullname,
    }

    return jsonify({"status": "success", "article": article_data}), 200


# Method GET - Mendapatkan artikel tertentu (Level: Public) /api/public/articles/{article_id}
# def get_article_by_id(article_id):
#     article = ArticleModel.query.get(article_id)
#     if not article:
#         return jsonify({"status": "error", "message": "Artikel tidak ditemukan"}), 404

#     # Tambah 1 pada total_views setiap kali artikel diakses
#     article.total_views += 1
#     db.session.commit()

#     comments = CommentModel.query.filter_by(article_id=article.id).all()
#     comment_count = len(comments)

#     article_data = {
#         "id": article.id,
#         "title": article.title,
#         "content": article.content,
#         "total_views": article.total_views,
#         "comment_count": comment_count,
#         "created_at": article.created_at,
#         "category_id": article.category_id,
#         "category_name": article.category.name,
#         "user_id": article.user_id,
#         "user_fullname": article.user.fullname,
#     }

#     return jsonify({"status": "success", "article": article_data}), 200


# ==========================================================================================================


# ==========================================================================================================
# API PRIVATE
# ==========================================================================================================


# Method POST - Membuat artikel baru (Level: Author Only) /api/private/articles
@jwt_required()
def create_article():
    # Cek Level Akses
    access_error = check_access_level(["Author"])
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
    required_fields = ["title", "content", "category_id"]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Field {} tidak boleh kosong".format(field),
                    }
                ),
                400,
            )

    # Cek ketersediaan kategori berdasarkan ID
    category = CategoryModel.query.get(data["category_id"])
    if not category:
        return jsonify({"status": "error", "message": "Kategori tidak ditemukan"}), 404

    last_article = ArticleModel.query.order_by(ArticleModel.id.desc()).first()
    new_id = 1 if not last_article else last_article.id + 1
    article = ArticleModel(
        id=new_id,
        title=data["title"],
        content=data["content"],
        category_id=data["category_id"],
        user_id=user_id,
    )
    db.session.add(article)
    db.session.commit()

    return jsonify({"status": "success", "message": "Artikel berhasil dibuat"}), 201


# Method GET - Mendapatkan semua artikel yang di posting oleh user tertentu (Level: Author) /api/private/articles
@jwt_required()
def get_all_articles_by_user():
    # Cek Level Akses
    access_error = check_access_level(["Author"])
    if access_error:
        return access_error

    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()
    
    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404

    articles = ArticleModel.query.filter_by(user_id=user_id).all()
    articles_list = []

    for article in articles:
        comments = CommentModel.query.filter_by(article_id=article.id).all()
        comment_count = len(comments)

        article_data = {
            "id": article.id,
            "title": article.title,
            "content": article.content,
            "total_views": article.total_views,
            "comment_count": comment_count,
            "created_at": article.created_at,
        }

        articles_list.append(article_data)

    return jsonify({"status": "success", "articles": articles_list}), 200


# Method PUT - Update artikel yang di posting oleh user tertentu (Level: Author) /api/private/articles/{article_id}
@jwt_required()
def update_article_by_id_and_user_id(article_id, user_id):
    # Cek Level Akses
    access_error = check_access_level(["Author"])
    if access_error:
        return access_error

    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()

    # Cek ketersediaan artikel berdasarkan ID
    article = ArticleModel.query.get(article_id)
    if not article:
        return jsonify({"status": "error", "message": "Artikel tidak ditemukan"}), 404
    
    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404
    

    # article = ArticleModel.query.get(article_id)
    # if not article:
    #     return jsonify({"status": "error", "message": "Artikel tidak ditemukan"}), 404

    # if article.user_id != user_id:
    #     return (
    #         jsonify(
    #             {
    #                 "status": "error",
    #                 "message": "Anda tidak berhak mengakses artikel ini",
    #             }
    #         ),
    #         403,
    # )

    data = request.get_json()

    # Validasi Field
    required_fields = ["title", "content", "category_id"]
    for field in required_fields:
        if not data.get(field):
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Field {} tidak boleh kosong".format(field),
                    }
                ),
                400,
            )

    # Cek ketersediaan kategori berdasarkan ID
    category = CategoryModel.query.get(data["category_id"])
    if not category:
        return jsonify({"status": "error", "message": "Kategori tidak ditemukan"}), 404

    article.title = data["title"]
    article.content = data["content"]
    article.category_id = data["category_id"]
    db.session.commit()

    return jsonify({"status": "success", "message": "Artikel berhasil diupdate"}), 200


# Method DELETE - Hapus artikel yang di posting oleh user tertentu (Level: Author) /api/private/articles/{article_id}
@jwt_required()
def delete_article_by_id_and_user_id(article_id):
    # Cek Level Akses
    access_error = check_access_level(["Author"])
    if access_error:
        return access_error
    
    # Ambil ID pengguna yang sedang login
    user_id = get_jwt_identity()

    # # Cek ketersediaan artikel berdasarkan ID
    article = ArticleModel.query.get(article_id)
    if not article:
        return jsonify({"status": "error", "message": "Artikel tidak ditemukan"}), 404
    
    # Cek ketersediaan user berdasarkan ID
    user = UserModel.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User tidak ditemukan"}), 404
    
    
    # article = ArticleModel.query.get(article_id)
    # if not article:
    #     return jsonify({"status": "error", "message": "Artikel tidak ditemukan"}), 404

    # if article.user_id != user_id:
    #     return (
    #         jsonify(
    #             {
    #                 "status": "error",
    #                 "message": "Anda tidak berhak mengakses artikel ini",
    #             }
    #         ),
    #         403,
    #     )

    db.session.delete(article)
    db.session.commit()

    return jsonify({"status": "success", "message": "Artikel berhasil dihapus"}), 200
