from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Notification, User

bp = Blueprint('notification', __name__, url_prefix='/v1/notifications')

@bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get all notifications for the current user"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    # Get unread first, then read, ordered by created_at descending
    notifications = Notification.query.filter_by(user_id=user_id).order_by(
        Notification.is_read.asc(),  # Unread first
        Notification.created_at.desc()
    ).all()
    
    return jsonify({
        'success': True,
        'data': [n.to_dict() for n in notifications],
        'unread_count': len([n for n in notifications if not n.is_read])
    }), 200

@bp.route('/unread', methods=['GET'])
@jwt_required()
def get_unread_count():
    """Get count of unread notifications"""
    user_id = get_jwt_identity()
    
    count = Notification.query.filter_by(user_id=user_id, is_read=False).count()
    
    return jsonify({
        'success': True,
        'data': {'count': count}
    }), 200

@bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notification_id):
    """Mark a notification as read"""
    user_id = get_jwt_identity()
    
    notification = Notification.query.get(notification_id)
    
    if not notification:
        return jsonify({'success': False, 'message': 'Notification not found'}), 404
    
    if notification.user_id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    try:
        notification.is_read = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': notification.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_read():
    """Mark all notifications as read for the current user"""
    user_id = get_jwt_identity()
    
    try:
        Notification.query.filter_by(user_id=user_id, is_read=False).update(
            {'is_read': True}
        )
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'All notifications marked as read'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Delete a notification"""
    user_id = get_jwt_identity()
    
    notification = Notification.query.get(notification_id)
    
    if not notification:
        return jsonify({'success': False, 'message': 'Notification not found'}), 404
    
    if notification.user_id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    try:
        db.session.delete(notification)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Notification deleted'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


def create_notification(user_id, title, message, notification_type='booking', related_id=None):
    """Helper function to create a notification"""
    try:
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            related_id=related_id
        )
        db.session.add(notification)
        db.session.commit()
        return notification
    except Exception as e:
        db.session.rollback()
        print(f"Error creating notification: {e}")
        return None

