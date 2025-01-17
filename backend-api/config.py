# config.py

import os
from flask import Flask
from dotenv import load_dotenv
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__, template_folder="app/templates")

# Configure app
app.config["SECRET_KEY"] = os.urandom(32).hex()
app.config["JWT_SECRET_KEY"] = app.config["SECRET_KEY"]

app.config["DEBUG"] = os.getenv("FLASK_DEBUG")
app.config["PORT"] = int(os.getenv("FLASK_RUN_PORT"))

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"{os.getenv('DB_CONNECTION')}://"
    f"{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/"
    f"{os.getenv('DB_NAME')}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize JWTManager
jwt = JWTManager(app)

# Initialize SQLAlchemy
db = SQLAlchemy(app)

CORS(app, supports_credentials=True, origins=[os.getenv("CORS_ORIGINS")])

# Create all database tables
# with app.app_context():
#     db.create_all()
