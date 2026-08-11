from flask import Blueprint, jsonify, request
from models.question import Question
import hashlib
import random
from datetime import date

aptitude_bp = Blueprint("aptitude", __name__)

@aptitude_bp.route("/api/aptitude/questions", methods=["POST"])
def get_questions():
    data = request.get_json()

    email = data.get("email", "guest").lower().strip()
    today = str(date.today())

    seed_text = email + today

    seed = int(
        hashlib.sha256(seed_text.encode()).hexdigest(),
        16
    )

    rng = random.Random(seed)

    all_questions = Question.query.order_by(
        Question.id
    ).all()

    if not all_questions:
        return jsonify([])

    total = len(all_questions)
    need = min(10, total)

    # pick spread positions across DB
    chosen_indexes = set()

    while len(chosen_indexes) < need:
        idx = rng.randint(0, total - 1)
        chosen_indexes.add(idx)

    selected = [
        all_questions[i]
        for i in chosen_indexes
    ]

    rng.shuffle(selected)

    result = []

    for q in selected:
        options = [
            q.option1,
            q.option2,
            q.option3,
            q.option4
        ]

        options = [x for x in options if x]
        rng.shuffle(options)

        result.append({
            "id": q.id,
            "question": q.question,
            "options": options,
            "answer": q.answer,
            "category": "aptitude"
        })

    return jsonify(result)