import os
from datetime import timedelta
import secrets

class Config:
    """Base configuration"""
    # Use SQLite by default (easier setup), can switch to PostgreSQL later
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///juaconnect.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', secrets.token_hex(32))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
    JSON_SORT_KEYS = False

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
