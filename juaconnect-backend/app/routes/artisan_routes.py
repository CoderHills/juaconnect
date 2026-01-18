from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User

bp = Blueprint('artisan', __name__, url_prefix='/v1/artisan')

@bp.route('/search', methods=['GET'])
def search_artisans():
    """Search for artisans by service category and/or location"""
    service_category = request.args.get('service_category')
    location = request.args.get('location')
    
    # Base query - only return verified artisans
    query = User.query.filter_by(user_type='artisan', is_verified=True)
    
    # Filter by service category
    if service_category:
        query = query.filter(User.service_category.ilike(f'%{service_category}%'))
    
    # Filter by location or service area
    if location:
        query = query.filter(
            (User.location.ilike(f'%{location}%')) | 
            (User.service_area.ilike(f'%{location}%'))
        )
    
    artisans = query.all()
    
    return jsonify({
        'success': True,
        'data': [artisan.to_dict() for artisan in artisans]
    }), 200

@bp.route('/', methods=['GET'])
def get_all_artisans():
    """Get all verified artisans"""
    artisans = User.query.filter_by(user_type='artisan', is_verified=True).all()
    
    return jsonify({
        'success': True,
        'data': [artisan.to_dict() for artisan in artisans]
    }), 200

@bp.route('/<int:artisan_id>', methods=['GET'])
def get_artisan(artisan_id):
    """Get artisan details by ID"""
    artisan = User.query.filter_by(id=artisan_id, user_type='artisan').first()
    
    if not artisan:
        return jsonify({
            'success': False,
            'message': 'Artisan not found'
        }), 404
    
    return jsonify({
        'success': True,
        'data': artisan.to_dict()
    }), 200

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_artisan_profile():
    """Get current artisan's profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'artisan':
        return jsonify({
            'success': False,
            'message': 'Artisan not found'
        }), 404
    
    return jsonify({
        'success': True,
        'data': user.to_dict()
    }), 200

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_artisan_profile():
    """Update current artisan's profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'artisan':
        return jsonify({
            'success': False,
            'message': 'Artisan not found'
        }), 404
    
    data = request.get_json()
    
    try:
        # Update basic fields
        user.phone = data.get('phone', user.phone)
        user.location = data.get('location', user.location)
        user.bio = data.get('bio', user.bio)
        user.service_category = data.get('service_category', user.service_category)
        user.experience_years = data.get('experience_years', user.experience_years)
        
        # Update additional profile fields
        user.profile_photo = data.get('profile_photo', user.profile_photo)
        user.skills = data.get('skills', user.skills)
        user.hourly_rate = data.get('hourly_rate', user.hourly_rate)
        user.availability = data.get('availability', user.availability)
        user.languages = data.get('languages', user.languages)
        user.service_area = data.get('service_area', user.service_area)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'Profile updated successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

