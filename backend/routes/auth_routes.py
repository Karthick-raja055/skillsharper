from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import db
from models.user import User

auth_bp = Blueprint("auth", __name__)


# STUDENT REGISTER ONLY
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not full_name or not email or not password:
        return jsonify({"message": "All fields required"}), 400

    existing = User.query.filter_by(email=email).first()

    if existing:
        return jsonify({"message": "Email already exists"}), 400

    user = User(
        full_name=full_name,
        email=email,
        role="student"
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registered Successfully"}), 201


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not user.check_password(password):
        return jsonify({"message": "Wrong password"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "name": user.full_name,
        "email": user.email,
        "role": user.role
    }), 200