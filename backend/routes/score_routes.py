from flask import Blueprint, request, jsonify
from models.score import Score
from extensions import db

score_bp = Blueprint("score", __name__)

@score_bp.route("/save", methods=["POST"])
def save_score():
    data = request.json

    new_score = Score(
        user_email=data["email"],
        round_name=data["round_name"],
        score=data["score"]
    )

    db.session.add(new_score)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Score Saved"
    })


@score_bp.route("/<email>", methods=["GET"])
def get_scores(email):
    rows = Score.query.filter_by(user_email=email).all()

    result = []

    for row in rows:
        result.append({
            "round_name": row.round_name,
            "score": row.score
        })

    return jsonify(result)