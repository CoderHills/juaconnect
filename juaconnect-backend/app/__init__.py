from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import DevelopmentConfig

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Register blueprints
    from app.routes import auth_routes, client_routes, artisan_routes, notification_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(client_routes.bp)
    app.register_blueprint(artisan_routes.bp)
    app.register_blueprint(notification_routes.bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app
