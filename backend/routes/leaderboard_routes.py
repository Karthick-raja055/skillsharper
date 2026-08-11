from flask import Blueprint, jsonify
from models.score import Score
from models.user import User
from extensions import db

leaderboard_bp = Blueprint("leaderboard", __name__)

@leaderboard_bp.route("/", methods=["GET"])
def leaderboard():
    rows = db.session.query(
        Score.user_email,
        db.func.avg(Score.score).label("avg_score")
    ).group_by(Score.user_email)\
     .order_by(db.desc("avg_score")).all()

    result = []

    for row in rows:
        user = User.query.filter_by(email=row.user_email).first()

        result.append({
            "name": user.name if user else "Unknown",
            "email": row.user_email,
            "score": round(row.avg_score)
        })

    return jsonify(result)