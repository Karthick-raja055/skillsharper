import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = "skillsharper_secret"

    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:raja1234@localhost/skillsharper"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "jwt_secret_key"