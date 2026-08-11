import csv
from app import app
from extensions import db
from models.question import Question

with app.app_context():

    # Delete old questions
    Question.query.delete()
    db.session.commit()

    with open(
        "10k Questions.csv",
        "r",
        encoding="utf-8"
    ) as file:

        reader = csv.DictReader(file)

        for row in reader:
            q = Question(
                question=row["question"],
                option1=row["option_a"],
                option2=row["option_b"],
                option3=row["option_c"],
                option4=row["option_d"],
                answer=row["answer"]
            )

            db.session.add(q)

        db.session.commit()

print("10,000 Questions Inserted Successfully")