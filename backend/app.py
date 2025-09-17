from flask import Flask
from flask_migrate import Migrate
from backend.models import db
from backend.config import Config  # Asegúrate que este archivo exista

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    Migrate(app, db)

    return app

