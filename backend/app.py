from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db, jwt

from routes.auth_routes import auth_bp
from routes.aptitude_routes import aptitude_bp
from routes.coding_routes import code_bp
from routes.score_routes import score_bp
from routes.leaderboard_routes import leaderboard_bp
from routes.dashboard_routes import dashboard_bp
from routes.admin_routes import admin_bp

from models.user import User
from models.question import Question
from models.score import Score

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)
jwt.init_app(app)

with app.app_context():
    db.create_all()

    # PERMANENT SUPER ADMIN
    admin = User.query.filter_by(
        email="admin@gmail.com"
    ).first()

    if not admin:
        admin = User(
            full_name="Super Admin",
            email="admin@gmail.com",
            role="admin"
        )

        admin.set_password("admin123")

        db.session.add(admin)
        db.session.commit()

        print("Permanent Admin Created")
    else:
        print("Admin Already Exists")


# ROUTES
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(aptitude_bp)
app.register_blueprint(code_bp, url_prefix="/api/code")
app.register_blueprint(score_bp, url_prefix="/api/scores")
app.register_blueprint(
    leaderboard_bp,
    url_prefix="/api/leaderboard"
)
app.register_blueprint(dashboard_bp)
app.register_blueprint(
    admin_bp,
    url_prefix="/api/admin"
)


@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "SkillSharper PRO Backend Running"
    })


if __name__ == "__main__":
    app.run(debug=True)