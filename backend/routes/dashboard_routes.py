from flask import Blueprint, jsonify
from models.user import User
from models.score import Score
from extensions import db
from sqlalchemy import func

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard/<email>", methods=["GET"])
def dashboard_stats(email):

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    scores = Score.query.filter_by(email=email).all()

    tests_completed = len(scores)

    if tests_completed > 0:
        overall_score = round(
            sum([s.score for s in scores]) / tests_completed
        )
    else:
        overall_score = 0

    # Rank Calculation
    all_users = User.query.all()

    leaderboard = []

    for u in all_users:
        user_scores = Score.query.filter_by(email=u.email).all()

        if len(user_scores) > 0:
            avg = sum([x.score for x in user_scores]) / len(user_scores)
        else:
            avg = 0

        leaderboard.append({
            "email": u.email,
            "avg": avg
        })

    leaderboard = sorted(
        leaderboard,
        key=lambda x: x["avg"],
        reverse=True
    )

    rank = 1

    for i, item in enumerate(leaderboard):
        if item["email"] == email:
            rank = i + 1
            break

    return jsonify({
        "overall_score": overall_score,
        "tests_completed": tests_completed,
        "rank": rank
    })