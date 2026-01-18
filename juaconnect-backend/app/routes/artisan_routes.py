from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, ServiceRequest
from app.routes.notification_routes import create_notification

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


# ============================================
# Artisan Request Management Endpoints
# These endpoints allow artisans to view and manage client service requests
# ============================================

@bp.route('/available-requests', methods=['GET'])
@jwt_required()
def get_available_requests():
    """Get all pending service requests that are available for artisans to accept.
    
    Returns requests that:
    - Have status 'pending'
    - Are not already assigned to an artisan (artisan_id is NULL)
    - Optionally filtered by the artisan's service category
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'artisan':
        return jsonify({
            'success': False,
            'message': 'Access denied. Only artisans can view available requests.'
        }), 403
    
    try:
        # Get all pending requests that are not yet assigned to any artisan
        # Optionally filter by matching service category if artisan has one
        query = ServiceRequest.query.filter_by(status='pending', artisan_id=None)
        
        if user.service_category:
            # Also show requests that match the artisan's service category
            # Using OR to include both: requests without specific artisan preference
            # OR requests that match the artisan's specialty
            matching_requests = ServiceRequest.query.filter_by(
                status='pending',
                artisan_id=None,
                service_category=user.service_category
            ).all()
            
            all_requests = query.all()
            
            # Combine and remove duplicates
            seen_ids = set()
            combined_requests = []
            for req in list(matching_requests) + list(all_requests):
                if req.id not in seen_ids:
                    seen_ids.add(req.id)
                    combined_requests.append(req)
            
            return jsonify({
                'success': True,
                'data': [req.to_dict() for req in combined_requests]
            }), 200
        
        requests = query.all()
        
        return jsonify({
            'success': True,
            'data': [req.to_dict() for req in requests]
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@bp.route('/accepted-requests', methods=['GET'])
@jwt_required()
def get_accepted_requests():
    """Get all service requests that have been accepted by the current artisan.
    
    Returns requests where:
    - artisan_id matches the current user's ID
    - Status is 'accepted' or 'in_progress'
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'artisan':
        return jsonify({
            'success': False,
            'message': 'Access denied. Only artisans can view their accepted requests.'
        }), 403
    
    try:
        # Get requests accepted by this artisan
        requests = ServiceRequest.query.filter(
            ServiceRequest.artisan_id == user_id,
            ServiceRequest.status.in_(['accepted', 'in_progress'])
        ).order_by(ServiceRequest.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [req.to_dict() for req in requests]
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@bp.route('/requests/<int:request_id>/accept', methods=['POST'])
@jwt_required()
def accept_request(request_id):
    """Accept a service request from a client.
    
    This assigns the request to the current artisan and changes status to 'accepted'.
    Only pending requests that are not yet assigned can be accepted.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'artisan':
        return jsonify({
            'success': False,
            'message': 'Access denied. Only artisans can accept requests.'
        }), 403
    
    service_request = ServiceRequest.query.get(request_id)
    
    if not service_request:
        return jsonify({
            'success': False,
            'message': 'Request not found.'
        }), 404
    
    if service_request.status != 'pending':
        return jsonify({
            'success': False,
            'message': f'Cannot accept request. Current status: {service_request.status}'
        }), 400
    
    if service_request.artisan_id is not None:
        return jsonify({
            'success': False,
            'message': 'This request has already been assigned to another artisan.'
        }), 400
    
    try:
        service_request.artisan_id = user_id
        service_request.status = 'accepted'
        db.session.commit()
        
        # Notify the client that their request has been accepted
        if service_request.client:
            create_notification(
                user_id=service_request.client_id,
                title='Request Accepted',
                message=f'{user.username} has accepted your {service_request.service_category} request!',
                notification_type='booking',
                related_id=service_request.id
            )
        
        return jsonify({
            'success': True,
            'data': service_request.to_dict(),
            'message': 'Request accepted successfully!'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@bp.route('/requests/<int:request_id>/reject', methods=['POST'])
@jwt_required()
def reject_request(request_id):
    """Reject a service request.
    
    For pending requests not yet assigned, this changes status to 'cancelled'.
    For assigned requests, this simply removes the artisan assignment.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'artisan':
        return jsonify({
            'success': False,
            'message': 'Access denied. Only artisans can reject requests.'
        }), 403
    
    service_request = ServiceRequest.query.get(request_id)
    
    if not service_request:
        return jsonify({
            'success': False,
            'message': 'Request not found.'
        }), 404
    
    # Check if this artisan is the one assigned to this request
    is_assigned = service_request.artisan_id == user_id
    
    if service_request.status == 'pending' and not is_assigned:
        # Not assigned to anyone, artisan is just viewing and choosing not to accept
        # No status change needed, just return success
        return jsonify({
            'success': True,
            'message': 'Request skipped.'
        }), 200
    
    if not is_assigned:
        return jsonify({
            'success': False,
            'message': 'You are not assigned to this request.'
        }), 403
    
    try:
        if service_request.status in ['pending', 'accepted']:
            service_request.status = 'cancelled'
            service_request.artisan_id = None
        elif service_request.status == 'in_progress':
            # If work already started, mark as cancelled but keep record
            service_request.status = 'cancelled'
        
        db.session.commit()
        
        # Notify the client
        if service_request.client:
            create_notification(
                user_id=service_request.client_id,
                title='Request Declined',
                message=f'Sorry, the artisan was unable to take on your {service_request.service_category} request.',
                notification_type='booking',
                related_id=service_request.id
            )
        
        return jsonify({
            'success': True,
            'data': service_request.to_dict(),
            'message': 'Request rejected successfully.'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@bp.route('/requests/<int:request_id>/start', methods=['POST'])
@jwt_required()
def start_work(request_id):
    """Mark a request as in_progress (work has started).
    
    Only the assigned artisan can mark work as started.
    Status must be 'accepted' before starting work.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'artisan':
        return jsonify({
            'success': False,
            'message': 'Access denied. Only artisans can start work.'
        }), 403
    
    service_request = ServiceRequest.query.get(request_id)
    
    if not service_request:
        return jsonify({
            'success': False,
            'message': 'Request not found.'
        }), 404
    
    if service_request.artisan_id != user_id:
        return jsonify({
            'success': False,
            'message': 'You are not assigned to this request.'
        }), 403
    
    if service_request.status != 'accepted':
        return jsonify({
            'success': False,
            'message': f'Cannot start work. Current status: {service_request.status}. Request must be accepted first.'
        }), 400
    
    try:
        service_request.status = 'in_progress'
        db.session.commit()
        
        # Notify the client that work has started
        if service_request.client:
            create_notification(
                user_id=service_request.client_id,
                title='Work Started',
                message=f'{user.username} has started working on your {service_request.service_category} request.',
                notification_type='booking',
                related_id=service_request.id
            )
        
        return jsonify({
            'success': True,
            'data': service_request.to_dict(),
            'message': 'Work started successfully!'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@bp.route('/requests/<int:request_id>/complete', methods=['POST'])
@jwt_required()
def complete_work(request_id):
    """Mark a request as completed.
    
    Only the assigned artisan can mark work as completed.
    Status must be 'in_progress' before completing.
    After completion, the client will be notified to make payment.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'artisan':
        return jsonify({
            'success': False,
            'message': 'Access denied. Only artisans can complete work.'
        }), 403
    
    service_request = ServiceRequest.query.get(request_id)
    
    if not service_request:
        return jsonify({
            'success': False,
            'message': 'Request not found.'
        }), 404
    
    if service_request.artisan_id != user_id:
        return jsonify({
            'success': False,
            'message': 'You are not assigned to this request.'
        }), 403
    
    if service_request.status != 'in_progress':
        return jsonify({
            'success': False,
            'message': f'Cannot complete. Current status: {service_request.status}. Work must be in progress first.'
        }), 400
    
    try:
        service_request.status = 'completed'
        db.session.commit()
        
        # Notify the client that work is complete and payment is due
        if service_request.client:
            create_notification(
                user_id=service_request.client_id,
                title='Work Completed - Payment Required',
                message=f'{user.username} has completed your {service_request.service_category} request. Please proceed with payment.',
                notification_type='payment',
                related_id=service_request.id
            )
        
        return jsonify({
            'success': True,
            'data': service_request.to_dict(),
            'message': 'Job completed! The client has been notified to make payment.'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


