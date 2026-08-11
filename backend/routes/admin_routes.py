from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models.user import User
from models.score import Score
from routes.admin_guard import admin_required
import random
import string

admin_bp = Blueprint("admin", __name__)


# DASHBOARD STATS
@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
@admin_required
def stats():

    students = User.query.filter_by(
        role="student"
    ).count()

    admins = User.query.filter_by(
        role="admin"
    ).count()

    reports = Score.query.count()

    return jsonify({
        "students": students,
        "admins": admins,
        "reports": reports
    })


# STUDENTS LIST
@admin_bp.route("/students", methods=["GET"])
@jwt_required()
@admin_required
def students():

    users = User.query.filter_by(
        role="student"
    ).order_by(User.id.desc()).all()

    result = []

    for u in users:
        result.append({
            "id": u.id,
            "name": u.full_name if u.full_name else "No Name",
            "email": u.email if u.email else "No Email"
        })

    return jsonify(result)


# CREATE ADMIN
@admin_bp.route("/create-admin", methods=["POST"])
@jwt_required()
@admin_required
def create_admin():

    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not name or not email or not password:
        return jsonify({
            "message": "All fields required"
        }), 400

    existing = User.query.filter_by(
        email=email
    ).first()

    if existing:
        return jsonify({
            "message": "Email already exists"
        }), 400

    user = User(
        full_name=name,
        email=email,
        role="admin"
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Admin created successfully"
    })


# DELETE STUDENT
@admin_bp.route("/delete-student/<int:id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_student(id):

    user = User.query.get(id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    if user.role == "admin":
        return jsonify({
            "message": "Cannot delete admin"
        }), 400

    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "message": "Student deleted"
    })


# SMART RESET PASSWORD
@admin_bp.route("/reset-password/<int:id>", methods=["POST"])
@jwt_required()
@admin_required
def reset_password(id):

    user = User.query.get(id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    temp_password = (
        random.choice(string.ascii_uppercase) +
        random.choice(string.ascii_lowercase) +
        random.choice(string.digits) +
        "#" +
        "".join(
            random.choices(
                string.ascii_letters +
                string.digits,
                k=4
            )
        )
    )

    user.set_password(temp_password)

    db.session.commit()

    return jsonify({
        "message": "Password reset successful",
        "temp_password": temp_password
    })