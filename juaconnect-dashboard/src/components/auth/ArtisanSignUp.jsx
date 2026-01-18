import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ArtisanSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    service_category: '',
    experience_years: '',
    location: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        service_category: formData.service_category,
        experience_years: parseInt(formData.experience_years),
        location: formData.location,
        bio: formData.bio,
        user_type: 'artisan'
      });

      if (response.success) {
        alert('Welcome! Your artisan profile has been created.');
        // Save token and user data to localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_type', response.data.user.user_type);
        navigate('/artisan-dashboard');
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px',
    textAlign: 'center',
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '32px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const groupStyle = {
    display: 'flex',
    gap: '12px',
  };

  const inputContainerStyle = {
    flex: 1,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '6px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const submitStyle = {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '16px',
    transition: 'all 0.3s',
  };

  const linkStyle = {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#7f8c8d',
  };

  const linkButtonStyle = {
    color: '#3498db',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: '600',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Register as Artisan</h2>
        <p style={subtitleStyle}>Join our network of skilled professionals</p>

        {error && (
          <div style={{ backgroundColor: '#fee', color: '#c33', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="john_artisan"
              required
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="john@example.com"
              required
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="0712345678"
              required
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Service Category</label>
            <select
              name="service_category"
              value={formData.service_category}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
              <option value="">Select Service</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Masonry">Masonry</option>
              <option value="Electrical">Electrical</option>
              <option value="Welding">Welding</option>
              <option value="General Repairs">General Repairs</option>
            </select>
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Years of Experience</label>
            <input
              type="number"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="e.g. 5"
              min="0"
              required
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Nairobi, Kenya"
            />
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Tell us about your skills and experience..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...submitStyle, opacity: loading ? 0.6 : 1 }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2980b9')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#3498db')}
          >
            {loading ? 'Creating Profile...' : 'Create Artisan Profile'}
          </button>
        </form>

        <div style={linkStyle}>
          Already registered?{' '}
          <button
            style={linkButtonStyle}
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
