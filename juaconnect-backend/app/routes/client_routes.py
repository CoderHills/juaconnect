from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import ServiceRequest, User, Booking
from app.routes.notification_routes import create_notification
from datetime import datetime

bp = Blueprint('client', __name__, url_prefix='/v1/client')

@bp.route('/requests', methods=['POST'])
@jwt_required()
def create_request():
    """Create a new service request"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'client':
        return jsonify({'success': False, 'message': 'Only clients can create requests'}), 403
    
    data = request.get_json()
    
    if not data or not data.get('service_category') or not data.get('description') or not data.get('location'):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    try:
        service_request = ServiceRequest(
            client_id=user_id,
            service_category=data['service_category'],
            description=data['description'],
            location=data['location'],
            budget=data.get('budget'),
            status='pending'
        )
        
        db.session.add(service_request)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': service_request.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@bp.route('/requests', methods=['GET'])
@jwt_required()
def get_my_requests():
    """Get all service requests made by the client"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'client':
        return jsonify({'success': False, 'message': 'Only clients can view requests'}), 403
    
    requests = ServiceRequest.query.filter_by(client_id=user_id).all()
    
    return jsonify({
        'success': True,
        'data': [req.to_dict() for req in requests]
    }), 200

@bp.route('/requests/<int:request_id>', methods=['GET'])
@jwt_required()
def get_request_detail(request_id):
    """Get details of a specific service request"""
    user_id = get_jwt_identity()
    service_request = ServiceRequest.query.get(request_id)
    
    if not service_request:
        return jsonify({'success': False, 'message': 'Request not found'}), 404
    
    if service_request.client_id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    return jsonify({
        'success': True,
        'data': service_request.to_dict()
    }), 200

@bp.route('/bookings', methods=['GET'])
@jwt_required()
def get_my_bookings():
    """Get all bookings for a client"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'client':
        return jsonify({'success': False, 'message': 'Only clients can view bookings'}), 403
    
    # Get all requests made by this client
    requests = ServiceRequest.query.filter_by(client_id=user_id).all()
    request_ids = [req.id for req in requests]
    
    # Get all bookings for these requests
    bookings = Booking.query.filter(Booking.request_id.in_(request_ids)).all()
    
    return jsonify({
        'success': True,
        'data': [booking.to_dict() for booking in bookings]
    }), 200

@bp.route('/requests/<int:request_id>', methods=['PUT'])
@jwt_required()
def cancel_request(request_id):
    """Cancel a service request"""
    user_id = get_jwt_identity()
    service_request = ServiceRequest.query.get(request_id)
    
    if not service_request:
        return jsonify({'success': False, 'message': 'Request not found'}), 404
    
    if service_request.client_id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    try:
        service_request.status = 'cancelled'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': service_request.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@bp.route('/book-artisan', methods=['POST'])
@jwt_required()
def book_artisan_direct():
    """Book a specific artisan directly (with artisan_id specified)"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.user_type != 'client':
        return jsonify({'success': False, 'message': 'Only clients can book artisans'}), 403
    
    data = request.get_json()
    
    artisan_id = data.get('artisan_id')
    service_category = data.get('service_category')
    description = data.get('description')
    location = data.get('location')
    budget = data.get('budget')
    preferred_date = data.get('preferred_date')
    
    if not artisan_id:
        return jsonify({'success': False, 'message': 'Artisan ID is required'}), 400
    
    if not service_category or not description or not location:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    artisan = User.query.get(artisan_id)
    
    if not artisan or artisan.user_type != 'artisan':
        return jsonify({'success': False, 'message': 'Artisan not found'}), 404
    
    try:
        service_request = ServiceRequest(
            client_id=user_id,
            artisan_id=artisan_id,
            service_category=service_category,
            description=description,
            location=location,
            budget=budget,
            status='pending'
        )
        
        db.session.add(service_request)
        db.session.commit()
        
        # Create notification for the artisan
        create_notification(
            user_id=artisan_id,
            title='New Booking Request',
            message=f'{user.username} has requested your services for {service_category}.',
            notification_type='booking',
            related_id=service_request.id
        )
        
        return jsonify({
            'success': True,
            'data': service_request.to_dict(),
            'message': 'Booking request sent successfully!'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
