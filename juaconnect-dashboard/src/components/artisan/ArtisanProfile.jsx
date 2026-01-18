import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Clock, DollarSign, Star, Edit2, Save, X, Image, Tag, Briefcase, Globe, Layers } from 'lucide-react';
import api from '../../services/api';

const ArtisanProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    location: '',
    service_category: '',
    experience_years: '',
    bio: '',
    skills: '',
    hourly_rate: '',
    languages: '',
    service_area: '',
    profile_photo: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getArtisanProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData({
          username: response.data.username || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          service_category: response.data.service_category || '',
          experience_years: response.data.experience_years || '',
          bio: response.data.bio || '',
          skills: response.data.skills || '',
          hourly_rate: response.data.hourly_rate || '',
          languages: response.data.languages || '',
          service_area: response.data.service_area || '',
          profile_photo: response.data.profile_photo || ''
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.updateArtisanProfile({
        username: formData.username,
        phone: formData.phone,
        location: formData.location,
        service_category: formData.service_category,
        experience_years: parseInt(formData.experience_years) || 0,
        bio: formData.bio,
        skills: formData.skills,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        languages: formData.languages,
        service_area: formData.service_area,
        profile_photo: formData.profile_photo
      });

      if (response.success) {
        setProfile(response.data);
        setEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    if (profile) {
      setFormData({
        username: profile.username || '',
        phone: profile.phone || '',
        location: profile.location || '',
        service_category: profile.service_category || '',
        experience_years: profile.experience_years || '',
        bio: profile.bio || '',
        skills: profile.skills || '',
        hourly_rate: profile.hourly_rate || '',
        languages: profile.languages || '',
        service_area: profile.service_area || '',
        profile_photo: profile.profile_photo || ''
      });
    }
  };

  const serviceCategories = [
    'Plumbing', 'Carpentry', 'Masonry', 'Electrical', 'Welding',
    'General Repairs', 'Painting', 'Gardening', 'Cleaning', 'Other'
  ];

  const containerStyle = {
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
    padding: '32px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  };

  const avatarStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#3498db',
    overflow: 'hidden',
  };

  const profileImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const headerInfoStyle = {
    flex: 1,
  };

  const nameStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '4px',
  };

  const categoryStyle = {
    fontSize: '16px',
    opacity: 0.9,
    marginBottom: '8px',
  };

  const statusBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '20px',
    backgroundColor: profile?.is_verified ? 'rgba(39, 174, 96, 0.9)' : 'rgba(243, 156, 18, 0.9)',
    fontSize: '13px',
    fontWeight: '500',
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    padding: '24px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ecf0f1',
  };

  const statStyle = {
    textAlign: 'center',
  };

  const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
  };

  const statLabelStyle = {
    fontSize: '13px',
    color: '#7f8c8d',
    marginTop: '4px',
  };

  const contentStyle = {
    padding: '24px',
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  };

  const infoIconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#e8f4fd',
    color: '#3498db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const infoLabelStyle = {
    fontSize: '12px',
    color: '#7f8c8d',
  };

  const infoValueStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2c3e50',
  };

  const bioStyle = {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    lineHeight: '1.6',
    color: '#2c3e50',
  };

  const skillsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  };

  const skillTagStyle = {
    padding: '6px 12px',
    backgroundColor: '#e8f4fd',
    color: '#3498db',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2c3e50',
  };

  const inputStyle = {
    padding: '12px 16px',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  };

  const buttonStyle = (variant) => ({
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: variant === 'primary' ? '#3498db' : '#ecf0f1',
    color: variant === 'primary' ? '#fff' : '#7f8c8d',
  });

  const messageStyle = (type) => ({
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
    color: type === 'success' ? '#155724' : '#721c24',
    border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
  });

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#7f8c8d' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {message.text && (
        <div style={messageStyle(message.type)}>
          {message.text}
        </div>
      )}

      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={avatarStyle}>
            {formData.profile_photo ? (
              <img src={formData.profile_photo} alt="Profile" style={profileImageStyle} />
            ) : (
              formData.username?.charAt(0).toUpperCase() || 'A'
            )}
          </div>
          <div style={headerInfoStyle}>
            <div style={nameStyle}>{profile?.username || 'Your Name'}</div>
            <div style={categoryStyle}>{profile?.service_category || 'No service category set'}</div>
            <div style={statusBadgeStyle}>
              <Star size={14} />
              {profile?.is_verified ? 'Verified Professional' : 'Pending Verification'}
            </div>
          </div>
          {!editing && (
            <button
              style={{ ...buttonStyle('primary'), backgroundColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => setEditing(true)}
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={statsStyle}>
          <div style={statStyle}>
            <div style={statValueStyle}>{profile?.experience_years || 0} yrs</div>
            <div style={statLabelStyle}>Experience</div>
          </div>
          <div style={statStyle}>
            <div style={statValueStyle}>{profile?.rating?.toFixed(1) || '0.0'}</div>
            <div style={statLabelStyle}>Rating</div>
          </div>
          <div style={statStyle}>
            <div style={statValueStyle}>{profile?.hourly_rate ? `Ksh ${profile.hourly_rate}` : 'N/A'}</div>
            <div style={statLabelStyle}>Hourly Rate</div>
          </div>
          <div style={statStyle}>
            <div style={statValueStyle}>{profile?.languages?.split(',').length || 0}</div>
            <div style={statLabelStyle}>Languages</div>
          </div>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {editing ? (
            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="e.g., Nairobi, Kenya"
                    required
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Service Area</label>
                  <input
                    type="text"
                    name="service_area"
                    value={formData.service_area}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="e.g., Nairobi, Kasarani, Westlands"
                  />
                </div>
              </div>

              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Service Category *</label>
                  <select
                    name="service_category"
                    value={formData.service_category}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Select category</option>
                    {serviceCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Years of Experience</label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
                  />
                </div>
              </div>

              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Hourly Rate (Ksh)</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
                    step="100"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Languages</label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="e.g., English, Swahili"
                  />
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g., Furniture, Doors, Windows, Cabinets"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  style={textareaStyle}
                  placeholder="Tell clients about yourself, your experience, and what you can help them with..."
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Profile Photo URL</label>
                <input
                  type="url"
                  name="profile_photo"
                  value={formData.profile_photo}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div style={buttonGroupStyle}>
                <button type="submit" style={buttonStyle('primary')} disabled={saving}>
                  {saving ? 'Saving...' : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
                <button type="button" style={buttonStyle('secondary')} onClick={cancelEdit}>
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Contact Info */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={sectionTitleStyle}>
                  <Phone size={20} />
                  Contact Information
                </h3>
                <div style={infoGridStyle}>
                  <div style={infoItemStyle}>
                    <div style={infoIconStyle}><Phone size={18} /></div>
                    <div>
                      <div style={infoLabelStyle}>Phone</div>
                      <div style={infoValueStyle}>{profile?.phone || 'Not set'}</div>
                    </div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoIconStyle}><MapPin size={18} /></div>
                    <div>
                      <div style={infoLabelStyle}>Location</div>
                      <div style={infoValueStyle}>{profile?.location || 'Not set'}</div>
                    </div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoIconStyle}><Globe size={18} /></div>
                    <div>
                      <div style={infoLabelStyle}>Service Area</div>
                      <div style={infoValueStyle}>{profile?.service_area || 'Not set'}</div>
                    </div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoIconStyle}><Globe size={18} /></div>
                    <div>
                      <div style={infoLabelStyle}>Languages</div>
                      <div style={infoValueStyle}>{profile?.languages || 'Not set'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={sectionTitleStyle}>
                  <User size={20} />
                  About Me
                </h3>
                <div style={bioStyle}>
                  {profile?.bio || 'No bio added yet. Add a description of yourself and your services.'}
                </div>
              </div>

              {/* Skills */}
              {profile?.skills && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={sectionTitleStyle}>
                    <Tag size={20} />
                    Skills & Expertise
                  </h3>
                  <div style={skillsStyle}>
                    {profile.skills.split(',').map((skill, index) => (
                      <span key={index} style={skillTagStyle}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              <div>
                <h3 style={sectionTitleStyle}>
                  <Briefcase size={20} />
                  Services Offered
                </h3>
                <div style={infoItemStyle}>
                  <div style={{ ...infoIconStyle, backgroundColor: '#d4edda', color: '#28a745' }}>
                    <Star size={18} />
                  </div>
                  <div>
                    <div style={infoLabelStyle}>Primary Service</div>
                    <div style={infoValueStyle}>{profile?.service_category || 'Not set'}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfile;

