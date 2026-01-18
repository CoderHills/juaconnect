import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../ui/Navbar";
import api from "../../services/api";

export default function Home() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', phone: '', service: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    setIsLoggedIn(!!token && userType === 'client');
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHireArtisan = () => {
    if (!isLoggedIn) {
      // Not logged in, redirect to signup
      alert('Please sign up first to request an artisan');
      navigate('/signup');
      return;
    }
    console.log('Hire Artisan clicked');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleRegisterArtisan = () => {
    navigate('/artisan-signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Creating service request...');
      const response = await api.createServiceRequest({
        service_category: formData.service,
        description: `Client requesting: ${formData.name}`,
        location: 'TBD',
        budget: null
      });

      console.log('Response:', response);

      if (response.success) {
        console.log('Request successful, redirecting to dashboard...');
        alert('Request sent! An artisan will contact you soon.');
        setFormData({ name: '', phone: '', service: '' });
        navigate('/client-dashboard');
      } else {
        console.log('Request failed:', response.message);
        setError(response.message || 'Failed to create request');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    color: '#fff',
    padding: '60px 20px',
    textAlign: 'center',
  };

  const heroTitleStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
    lineHeight: '1.2',
  };

  const heroDescStyle = {
    fontSize: '18px',
    marginBottom: '32px',
    opacity: '0.9',
    maxWidth: '600px',
    margin: '0 auto 32px',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const primaryButtonStyle = {
    backgroundColor: '#fff',
    color: '#3498db',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s',
  };

  const secondaryButtonStyle = {
    backgroundColor: 'transparent',
    color: '#fff',
    padding: '12px 24px',
    border: '2px solid #fff',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s',
  };

  const sectionStyle = {
    padding: '60px 20px',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const sectionTitleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#2c3e50',
  };

  const servicesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  };

  const serviceCardStyle = {
    padding: '24px',
    border: '1px solid #bdc3c7',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundColor: '#fff',
    transition: 'all 0.3s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const serviceIconStyle = {
    width: '64px',
    height: '64px',
    backgroundColor: '#ecf0f1',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3498db',
  };

  const stepsStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '32px',
  };

  const stepStyle = {
    textAlign: 'center',
    flex: '1',
    minWidth: '200px',
  };

  const stepNumberStyle = {
    width: '64px',
    height: '64px',
    backgroundColor: '#3498db',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 16px',
  };

  const stepTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#2c3e50',
  };

  const ctaStyle = {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '60px 20px',
  };

  const ctaTitleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '16px',
  };

  const ctaDescStyle = {
    fontSize: '18px',
    marginBottom: '32px',
    opacity: '0.9',
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const inputStyle = {
    padding: '12px',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  };

  const submitButtonStyle = {
    backgroundColor: '#fff',
    color: '#3498db',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s',
  };

  const footerStyle = {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '40px 20px',
    textAlign: 'center',
  };

  const services = ['Plumbing', 'Carpentry', 'Masonry', 'Electrical', 'Welding', 'Repairs'];
  const steps = [
    { num: '1', title: 'Post a Job', desc: 'Tell us what service you need' },
    { num: '2', title: 'Get Matched', desc: 'We connect you with skilled artisans' },
    { num: '3', title: 'Get It Done', desc: 'Hire, pay securely, and rate' },
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5' }}>
      <Navbar />
      
      {/* Hero Section */}
      <header style={heroStyle}>
        <div style={containerStyle}>
          <h1 style={heroTitleStyle}>Find Trusted Artisans</h1>
          <p style={heroDescStyle}>JuaConnect links skilled Juakali artisans with clients across Kenya — fast, secure, and reliable.</p>
          <div style={buttonGroupStyle}>
            <button onClick={handleHireArtisan} style={primaryButtonStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#ecf0f1'} onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}>
              Hire an Artisan
            </button>
            <button style={secondaryButtonStyle} onClick={handleRegisterArtisan} onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.borderColor = '#fff';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#fff';
            }}>
              Register as Artisan
            </button>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section style={{ ...sectionStyle, backgroundColor: '#fff' }}>
        <div style={containerStyle}>
          <h2 style={sectionTitleStyle}>Services We Offer</h2>
          <div style={servicesGridStyle}>
            {services.map((service) => (
              <div key={service} style={serviceCardStyle} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
                <div style={serviceIconStyle}>{service[0]}</div>
                <h3 style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ ...sectionStyle, backgroundColor: '#f5f5f5' }}>
        <div style={containerStyle}>
          <h2 style={sectionTitleStyle}>How JuaConnect Works</h2>
          <div style={stepsStyle}>
            {steps.map((item) => (
              <div key={item.num} style={stepStyle}>
                <div style={stepNumberStyle}>{item.num}</div>
                <h3 style={stepTitleStyle}>{item.title}</h3>
                <p style={{ color: '#7f8c8d', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaStyle} ref={formRef}>
        <div style={containerStyle}>
          <h2 style={{ ...sectionTitleStyle, color: '#fff' }}>Need a Skilled Artisan?</h2>
          <p style={ctaDescStyle}>Get connected in minutes.</p>
          
          {isLoggedIn ? (
            <>
              {error && (
                <div style={{ backgroundColor: 'rgba(255,100,100,0.2)', color: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px', maxWidth: '400px', margin: '0 auto 16px' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={formStyle}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (e.g. 07XX XXX XXX)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Select Service</option>
                  <option>Plumbing</option>
                  <option>Carpentry</option>
                  <option>Masonry</option>
                  <option>Electrical</option>
                  <option>Welding</option>
                  <option>General Repairs</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...submitButtonStyle, opacity: loading ? 0.6 : 1 }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#ecf0f1')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#fff')}
                >
                  {loading ? 'Sending Request...' : 'Request Artisan'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <p style={{ fontSize: '18px', marginBottom: '20px' }}>Sign up to post a job and get connected with skilled artisans.</p>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  backgroundColor: '#fff',
                  color: '#3498db',
                  padding: '12px 32px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#ecf0f1'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
              >
                Sign Up Now
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={containerStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>JuaConnect</h3>
          <p style={{ margin: '0 0 16px', opacity: '0.9' }}>Bridging skilled artisans with clients across Kenya.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '16px', fontSize: '14px' }}>
            <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>About</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Services</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Privacy</a>
          </div>
          <p style={{ margin: 0, opacity: '0.7', fontSize: '12px' }}>© 2026 JuaConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
