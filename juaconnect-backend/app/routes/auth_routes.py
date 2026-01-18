from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User

bp = Blueprint('auth', __name__, url_prefix='/v1/auth')

@bp.route('/signup', methods=['POST'])
def signup():
    """Register a new user (client or artisan)"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('username'):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'success': False, 'message': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'message': 'Username already taken'}), 400
    
    try:
        user_type = data.get('user_type', 'client')  # default to client
        
        user = User(
            username=data['username'],
            email=data['email'],
            user_type=user_type,
            phone=data.get('phone'),
            location=data.get('location'),
            service_category=data.get('service_category') if user_type == 'artisan' else None,
            experience_years=data.get('experience_years') if user_type == 'artisan' else None,
            bio=data.get('bio') if user_type == 'artisan' else None,
            is_verified=True if user_type == 'artisan' else False,  # Auto-verify artisans for testing
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'data': {
                'token': access_token,
                'user': user.to_dict()
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@bp.route('/signin', methods=['POST'])
def signin():
    """Login a user"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'success': False, 'message': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    
    try:
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'data': {
                'token': access_token,
                'user': user.to_dict()
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    return jsonify({
        'success': True,
        'data': user.to_dict()
    }), 200

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    data = request.get_json()
    
    try:
        user.phone = data.get('phone', user.phone)
        user.location = data.get('location', user.location)
        user.bio = data.get('bio', user.bio)
        
        if user.user_type == 'artisan':
            user.service_category = data.get('service_category', user.service_category)
            user.experience_years = data.get('experience_years', user.experience_years)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': user.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
