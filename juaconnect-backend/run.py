from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
jwt = JWTManager(app)
CORS(app)

# In-memory database
_users = {}
_requests = {}
_bookings = {}
_id_counters = {'user': 1, 'request': 1, 'booking': 1}

def get_next_id(entity_type):
    global _id_counters
    _id_counters[entity_type] += 1
    return _id_counters[entity_type]

# Auth routes
@app.route('/v1/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data or not all(k in data for k in ['email', 'password', 'username']):
        return {'success': False, 'message': 'Missing required fields'}, 400
    
    if data['email'] in [u['email'] for u in _users.values()]:
        return {'success': False, 'message': 'Email already registered'}, 400
    
    user_id = get_next_id('user')
    user = {
        'id': user_id,
        'username': data['username'],
        'email': data['email'],
        'user_type': data.get('user_type', 'client'),
        'phone': data.get('phone'),
        'location': data.get('location'),
        'service_category': data.get('service_category'),
        'experience_years': data.get('experience_years'),
        'bio': data.get('bio'),
        'created_at': datetime.utcnow().isoformat(),
    }
    _users[user_id] = user
    token = create_access_token(identity=str(user_id))
    
    return {'success': True, 'data': {'token': token, 'user': user}}, 201

@app.route('/v1/auth/signin', methods=['POST'])
def signin():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return {'success': False, 'message': 'Missing email or password'}, 400
    
    user = next((u for u in _users.values() if u['email'] == data['email']), None)
    if not user:
        return {'success': False, 'message': 'Invalid email or password'}, 401
    
    token = create_access_token(identity=str(user['id']))
    return {'success': True, 'data': {'token': token, 'user': user}}, 200

@app.route('/v1/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = _users.get(user_id)
    if not user:
        return {'success': False, 'message': 'User not found'}, 404
    return {'success': True, 'data': user}, 200

@app.route('/v1/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = _users.get(user_id)
    if not user:
        return {'success': False, 'message': 'User not found'}, 404
    
    data = request.get_json()
    user.update({k: v for k, v in data.items() if k in ['phone', 'location', 'bio', 'service_category', 'experience_years']})
    return {'success': True, 'data': user}, 200

# Client routes
@app.route('/v1/client/requests', methods=['POST'])
@jwt_required()
def create_request():
    user_id = int(get_jwt_identity())
    user = _users.get(user_id)
    if not user or user['user_type'] != 'client':
        return {'success': False, 'message': 'Only clients can create requests'}, 403
    
    data = request.get_json()
    if not data or not all(k in data for k in ['service_category', 'description', 'location']):
        return {'success': False, 'message': 'Missing required fields'}, 400
    
    req_id = get_next_id('request')
    service_req = {
        'id': req_id,
        'client_id': user_id,
        'client': user,
        'artisan_id': None,
        'artisan': None,
        'service_category': data['service_category'],
        'description': data['description'],
        'status': 'pending',
        'location': data['location'],
        'budget': data.get('budget'),
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat(),
    }
    _requests[req_id] = service_req
    return {'success': True, 'data': service_req}, 201

@app.route('/v1/client/requests', methods=['GET'])
@jwt_required()
def get_my_requests():
    user_id = int(get_jwt_identity())
    user = _users.get(user_id)
    if not user or user['user_type'] != 'client':
        return {'success': False, 'message': 'Only clients can view requests'}, 403
    
    reqs = [r for r in _requests.values() if r['client_id'] == user_id]
    return {'success': True, 'data': reqs}, 200

@app.route('/v1/client/requests/<int:req_id>', methods=['GET'])
@jwt_required()
def get_request_detail(req_id):
    user_id = int(get_jwt_identity())
    service_req = _requests.get(req_id)
    if not service_req or service_req['client_id'] != user_id:
        return {'success': False, 'message': 'Not found or unauthorized'}, 404
    return {'success': True, 'data': service_req}, 200

@app.route('/v1/client/bookings', methods=['GET'])
@jwt_required()
def get_my_bookings():
    user_id = int(get_jwt_identity())
    bookings = [b for b in _bookings.values() if _requests.get(b['request_id'], {}).get('client_id') == user_id]
    return {'success': True, 'data': bookings}, 200

# Artisan routes
@app.route('/v1/artisan/available-requests', methods=['GET'])
@jwt_required()
def get_available_requests():
    user_id = int(get_jwt_identity())
    user = _users.get(user_id)
    if not user or user['user_type'] != 'artisan':
        return {'success': False, 'message': 'Only artisans can view requests'}, 403
    
    reqs = [r for r in _requests.values() if r['status'] == 'pending' and r['service_category'] == user.get('service_category')]
    return {'success': True, 'data': reqs}, 200

@app.route('/v1/artisan/accepted-requests', methods=['GET'])
@jwt_required()
def get_accepted_requests():
    user_id = int(get_jwt_identity())
    reqs = [r for r in _requests.values() if r['artisan_id'] == user_id]
    return {'success': True, 'data': reqs}, 200

@app.route('/v1/artisan/requests/<int:req_id>/accept', methods=['POST'])
@jwt_required()
def accept_request(req_id):
    user_id = int(get_jwt_identity())
    user = _users.get(user_id)
    if not user or user['user_type'] != 'artisan':
        return {'success': False, 'message': 'Only artisans can accept requests'}, 403
    
    service_req = _requests.get(req_id)
    if not service_req:
        return {'success': False, 'message': 'Request not found'}, 404
    
    if service_req['status'] != 'pending':
        return {'success': False, 'message': 'Request is not available'}, 400
    
    service_req['artisan_id'] = user_id
    service_req['artisan'] = user
    service_req['status'] = 'accepted'
    service_req['updated_at'] = datetime.utcnow().isoformat()
    return {'success': True, 'data': service_req}, 200

@app.route('/v1/artisan/requests/<int:req_id>/start', methods=['POST'])
@jwt_required()
def start_work(req_id):
    user_id = int(get_jwt_identity())
    service_req = _requests.get(req_id)
    if not service_req or service_req['artisan_id'] != user_id:
        return {'success': False, 'message': 'Not authorized'}, 403
    
    data = request.get_json() or {}
    booking_id = get_next_id('booking')
    booking = {
        'id': booking_id,
        'request_id': req_id,
        'start_date': datetime.utcnow().isoformat(),
        'end_date': None,
        'total_amount': data.get('total_amount'),
        'status': 'scheduled',
        'created_at': datetime.utcnow().isoformat(),
    }
    _bookings[booking_id] = booking
    service_req['status'] = 'in_progress'
    service_req['updated_at'] = datetime.utcnow().isoformat()
    return {'success': True, 'data': booking}, 201

@app.route('/v1/artisan/requests/<int:req_id>/complete', methods=['POST'])
@jwt_required()
def complete_work(req_id):
    user_id = int(get_jwt_identity())
    service_req = _requests.get(req_id)
    if not service_req or service_req['artisan_id'] != user_id:
        return {'success': False, 'message': 'Not authorized'}, 403
    
    booking = next((b for b in _bookings.values() if b['request_id'] == req_id), None)
    if booking:
        booking['end_date'] = datetime.utcnow().isoformat()
        booking['status'] = 'completed'
    
    service_req['status'] = 'completed'
    service_req['updated_at'] = datetime.utcnow().isoformat()
    return {'success': True, 'data': service_req}, 200

@app.route('/v1/artisan/profile', methods=['GET'])
@jwt_required()
def get_artisan_profile():
    user_id = int(get_jwt_identity())
    user = _users.get(user_id)
    if not user or user['user_type'] != 'artisan':
        return {'success': False, 'message': 'Only artisans can access this'}, 403
    return {'success': True, 'data': user}, 200

@app.route('/v1/artisan/search', methods=['GET'])
def search_artisans():
    service_category = request.args.get('service_category')
    location = request.args.get('location')
    
    artisans = [u for u in _users.values() if u['user_type'] == 'artisan']
    
    if service_category:
        artisans = [a for a in artisans if a.get('service_category') == service_category]
    if location:
        artisans = [a for a in artisans if location.lower() in (a.get('location') or '').lower()]
    
    return {'success': True, 'data': artisans}, 200

# Public artisan listing endpoints (for clients to browse)
@app.route('/v1/artisans', methods=['GET'])
def get_all_artisans():
    """Get all artisans (public endpoint for clients to browse)"""
    artisans = [u for u in _users.values() if u['user_type'] == 'artisan']
    # Remove sensitive info
    safe_artisans = []
    for a in artisans:
        safe_artisans.append({
            'id': a['id'],
            'username': a['username'],
            'email': a.get('email', ''),
            'phone': a.get('phone'),
            'location': a.get('location'),
            'service_category': a.get('service_category'),
            'bio': a.get('bio'),
            'experience_years': a.get('experience_years'),
            'hourly_rate': a.get('hourly_rate'),
            'business_name': a.get('business_name'),
            'skills': a.get('skills'),
            'rating': a.get('rating', 4.5),
            'completed_jobs': a.get('completed_jobs', 0),
        })
    return {'success': True, 'data': safe_artisans}, 200

@app.route('/v1/artisans/<int:artisan_id>', methods=['GET'])
def get_artisan_by_id(artisan_id):
    """Get artisan details by ID (public endpoint)"""
    user = _users.get(artisan_id)
    if not user or user['user_type'] != 'artisan':
        return {'success': False, 'message': 'Artisan not found'}, 404
    
    return {
        'success': True,
        'data': {
            'id': user['id'],
            'username': user['username'],
            'email': user.get('email', ''),
            'phone': user.get('phone'),
            'location': user.get('location'),
            'service_category': user.get('service_category'),
            'bio': user.get('bio'),
            'experience_years': user.get('experience_years'),
            'hourly_rate': user.get('hourly_rate'),
            'business_name': user.get('business_name'),
            'skills': user.get('skills'),
            'rating': user.get('rating', 4.5),
            'completed_jobs': user.get('completed_jobs', 0),
        }
    }, 200

# Direct booking endpoint
@app.route('/v1/client/book', methods=['POST'])
@jwt_required()
def book_artisan():
    """Direct booking of an artisan by a client"""
    user_id = int(get_jwt_identity())
    user = _users.get(user_id)
    if not user or user['user_type'] != 'client':
        return {'success': False, 'message': 'Only clients can book artisans'}, 403
    
    data = request.get_json()
    if not data or not all(k in data for k in ['artisan_id', 'service_category', 'description', 'location']):
        return {'success': False, 'message': 'Missing required fields: artisan_id, service_category, description, location'}, 400
    
    artisan = _users.get(data['artisan_id'])
    if not artisan or artisan['user_type'] != 'artisan':
        return {'success': False, 'message': 'Artisan not found'}, 404
    
    booking_id = get_next_id('booking')
    booking = {
        'id': booking_id,
        'client_id': user_id,
        'client': user,
        'artisan_id': data['artisan_id'],
        'artisan': artisan,
        'service_category': data['service_category'],
        'description': data['description'],
        'location': data['location'],
        'budget': data.get('budget'),
        'scheduled_date': data.get('scheduled_date'),
        'status': 'pending',  # pending, confirmed, in_progress, completed, cancelled
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat(),
    }
    _bookings[booking_id] = booking
    return {'success': True, 'data': booking}, 201

@app.route('/v1/client/my-bookings', methods=['GET'])
@jwt_required()
def get_client_bookings():
    """Get all direct bookings for a client"""
    user_id = int(get_jwt_identity())
    user = _users.get(user_id)
    if not user or user['user_type'] != 'client':
        return {'success': False, 'message': 'Only clients can view bookings'}, 403
    
    bookings = [b for b in _bookings.values() if b['client_id'] == user_id]
    return {'success': True, 'data': bookings}, 200

@app.route('/v1/client/bookings/<int:booking_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_booking(booking_id):
    """Cancel a booking"""
    user_id = int(get_jwt_identity())
    booking = _bookings.get(booking_id)
    if not booking or booking['client_id'] != user_id:
        return {'success': False, 'message': 'Booking not found or unauthorized'}, 404
    
    if booking['status'] in ['completed', 'cancelled']:
        return {'success': False, 'message': 'Cannot cancel a completed or already cancelled booking'}, 400
    
    booking['status'] = 'cancelled'
    booking['updated_at'] = datetime.utcnow().isoformat()
    return {'success': True, 'data': booking}, 200

@app.route('/v1/client/bookings/<int:booking_id>/confirm', methods=['PUT'])
@jwt_required()
def confirm_booking(booking_id):
    """Artisan confirms a booking"""
    user_id = int(get_jwt_identity())
    booking = _bookings.get(booking_id)
    if not booking or booking['artisan_id'] != user_id:
        return {'success': False, 'message': 'Booking not found or unauthorized'}, 404
    
    if booking['status'] != 'pending':
        return {'success': False, 'message': 'Can only confirm pending bookings'}, 400
    
    booking['status'] = 'confirmed'
    booking['updated_at'] = datetime.utcnow().isoformat()
    return {'success': True, 'data': booking}, 200

if __name__ == '__main__':
    print("🚀 JuaConnect Backend starting on http://0.0.0.0:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')
