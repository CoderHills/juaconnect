import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, FileText, User, Phone } from 'lucide-react';
import api from '../../services/api';

const BookingForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    service: '',
    description: '',
    location: '',
    budget: '',
    preferredDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const services = [
    'Plumbing',
    'Carpentry',
    'Masonry',
    'Electrical',
    'Welding',
    'General Repairs',
    'Painting',
    'Gardening',
    'Cleaning',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting service request...');
      console.log('Form data:', formData);
      
      const response = await api.createServiceRequest({
        service_category: formData.service,
        description: `${formData.clientName}: ${formData.description}`,
        location: formData.location,
        budget: formData.budget ? parseFloat(formData.budget) : null,
      });

      console.log('API Response:', response);
      
      if (response.success) {
        alert('Service request submitted successfully! Artisans will be notified.');
        if (onSuccess) onSuccess(response.data);
      } else {
        setError(response.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Booking form error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '24px',
    textAlign: 'center',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const inputStyle = {
    padding: '12px 16px',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%237f8c8d\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: '40px',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  };

  const submitButtonStyle = {
    flex: 1,
    padding: '14px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#3498db',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: loading ? 0.7 : 1,
  };

  const cancelButtonStyle = {
    ...submitButtonStyle,
    backgroundColor: '#ecf0f1',
    color: '#7f8c8d',
  };

  const errorStyle = {
    backgroundColor: '#fdf0ed',
    color: '#e74c3c',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid #f5c6cb',
  };

  const infoBoxStyle = {
    backgroundColor: '#e8f4fd',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#2980b9',
    lineHeight: '1.5',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Request an Artisan</h2>

      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Client Info */}
        <div style={rowStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              <User size={16} />
              Your Name *
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="John Doe"
              style={inputStyle}
              required
            />
          </div>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              <Phone size={16} />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="07XX XXX XXX"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Service Type */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>
            <FileText size={16} />
            Service Type *
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            style={selectStyle}
            required
          >
            <option value="">Select a service...</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>
            <MapPin size={16} />
            Location / Address *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Kilimani, Nairobi"
            style={inputStyle}
            required
          />
        </div>

        {/* Date and Budget */}
        <div style={rowStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              <Calendar size={16} />
              Preferred Date
            </label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              style={inputStyle}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              <DollarSign size={16} />
              Budget (Ksh)
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="5000"
              style={inputStyle}
              min="0"
              step="100"
            />
          </div>
        </div>

        {/* Description */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>
            <FileText size={16} />
            Job Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what needs to be done in detail..."
            style={textareaStyle}
            required
          />
        </div>

        {/* Info Box */}
        <div style={infoBoxStyle}>
          <strong>How it works:</strong> Your request will be sent to available artisans in your area.
          They can accept or reject your request. You'll receive notifications about the status.
        </div>

        {/* Buttons */}
        <div style={buttonGroupStyle}>
          {onCancel && (
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            style={submitButtonStyle}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;

