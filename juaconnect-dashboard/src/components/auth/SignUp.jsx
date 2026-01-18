import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import api from '../../services/api';

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.register({
        username,
        email,
        password,
        phone,
        location,
        user_type: 'client'
      });

      if (response.success) {
        alert('Account created successfully!');
        // Save token and user data to localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_type', response.data.user.user_type);
        navigate('/client-dashboard');
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
    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    color: '#fff',
    padding: '32px 24px',
    textAlign: 'center',
  };

  const headerTitleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px',
  };

  const headerDescStyle = {
    fontSize: '14px',
    opacity: '0.9',
    margin: '0',
  };

  const formContainerStyle = {
    padding: '32px 24px',
  };

  const errorStyle = {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #fecaca',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const formGroupStyle = {
    marginBottom: '18px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: '#3498db',
    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)',
  };

  const iconStyle = {
    position: 'absolute',
    left: '12px',
    color: '#7f8c8d',
    width: '18px',
    height: '18px',
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '8px',
  };

  const footerStyle = {
    padding: '20px 24px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    borderTop: '1px solid #e0e0e0',
  };

  const linkStyle = {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={headerTitleStyle}>Create Account</h1>
          <p style={headerDescStyle}>Join JuaConnect and find trusted artisans</p>
        </div>

        {/* Form */}
        <div style={formContainerStyle}>
          {error && (
            <div style={errorStyle}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={formGroupStyle}>
              <label style={labelStyle} htmlFor="username">
                Username
              </label>
              <div style={inputWrapperStyle}>
                <User style={iconStyle} size={18} />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  style={inputStyle}
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div style={formGroupStyle}>
              <label style={labelStyle} htmlFor="email">
                Email Address
              </label>
              <div style={inputWrapperStyle}>
                <Mail style={iconStyle} size={18} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  style={inputStyle}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={formGroupStyle}>
              <label style={labelStyle} htmlFor="password">
                Password
              </label>
              <div style={inputWrapperStyle}>
                <Lock style={iconStyle} size={18} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  style={inputStyle}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div style={formGroupStyle}>
              <label style={labelStyle} htmlFor="phone">
                Phone Number
              </label>
              <div style={inputWrapperStyle}>
                <Phone style={iconStyle} size={18} />
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  style={inputStyle}
                  placeholder="0712345678"
                />
              </div>
            </div>

            {/* Location */}
            <div style={formGroupStyle}>
              <label style={labelStyle} htmlFor="location">
                Location
              </label>
              <div style={inputWrapperStyle}>
                <MapPin style={iconStyle} size={18} />
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  style={inputStyle}
                  placeholder="Nairobi, Kenya"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...submitButtonStyle,
                backgroundColor: loading ? '#7f8c8d' : '#3498db',
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2980b9')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#3498db')}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#7f8c8d' }}>
            Already have an account?
          </p>
          <Link
            to="/signin"
            style={{
              ...linkStyle,
              fontSize: '16px',
            }}
            onMouseEnter={(e) => e.target.style.color = '#2980b9'}
            onMouseLeave={(e) => e.target.style.color = '#3498db'}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

