import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, ChevronRight, Clock, Award, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const ArtisanDirectory = ({ onBookArtisan }) => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    service_category: '',
    description: '',
    location: '',
    budget: '',
    preferred_date: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const response = await api.searchArtisans(serviceFilter, locationFilter);
      if (response.success) {
        setArtisans(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (artisan) => {
    setSelectedArtisan(artisan);
  };

  const handleBookClick = (artisan) => {
    setSelectedArtisan(artisan);
    setBookingFormData({
      service_category: artisan.service_category || '',
      description: '',
      location: '',
      budget: '',
      preferred_date: ''
    });
    setShowBookingForm(true);
  };

  const handleBookingChange = (e) => {
    setBookingFormData({ ...bookingFormData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Submitting booking request...');
      console.log('Selected artisan:', selectedArtisan);
      console.log('Booking data:', {
        artisan_id: selectedArtisan?.id,
        service_category: bookingFormData.service_category,
        description: bookingFormData.description,
        location: bookingFormData.location,
        budget: bookingFormData.budget ? parseFloat(bookingFormData.budget) : null,
        preferred_date: bookingFormData.preferred_date
      });
      
      const response = await api.bookArtisanDirect({
        artisan_id: selectedArtisan.id,
        service_category: bookingFormData.service_category,
        description: bookingFormData.description,
        location: bookingFormData.location,
        budget: bookingFormData.budget ? parseFloat(bookingFormData.budget) : null,
        preferred_date: bookingFormData.preferred_date
      });

      console.log('API Response:', response);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Booking request sent successfully! The artisan will be notified.' });
        setShowBookingForm(false);
        if (onBookArtisan) onBookArtisan(response.data);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to send booking request' });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const serviceCategories = [
    'All Services',
    'Plumbing', 'Carpentry', 'Masonry', 'Electrical', 'Welding',
    'General Repairs', 'Painting', 'Gardening', 'Cleaning'
  ];

  const filteredArtisans = artisans.filter(artisan => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      artisan.username?.toLowerCase().includes(search) ||
      artisan.service_category?.toLowerCase().includes(search) ||
      artisan.skills?.toLowerCase().includes(search) ||
      artisan.bio?.toLowerCase().includes(search)
    );
  });

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Trusted Artisans</h1>
        <p style={styles.heroSubtitle}>Connect with skilled professionals for all your service needs</p>
      </div>

      {/* Search Section */}
      <div style={styles.searchContainer}>
        <div style={styles.searchBox}>
          <div style={styles.searchRow}>
            <div style={styles.inputWrapper}>
              <Search style={styles.inputIcon} size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search artisans by name, skill..."
                style={styles.searchInput}
              />
            </div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value === 'All Services' ? '' : e.target.value)}
              style={styles.selectInput}
            >
              {serviceCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div style={styles.inputWrapper}>
              <MapPin style={styles.inputIcon} size={20} />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Location"
                style={styles.searchInput}
              />
            </div>
            <button 
              style={styles.searchButton}
              onClick={() => fetchArtisans()}
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div style={styles.resultsContainer}>
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading artisans...</p>
          </div>
        ) : filteredArtisans.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3>No artisans found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredArtisans.map(artisan => (
              <div
                key={artisan.id}
                style={{
                  ...styles.card,
                  border: selectedArtisan?.id === artisan.id ? '2px solid #6366f1' : '1px solid #e5e7eb'
                }}
                onClick={() => handleViewProfile(artisan)}
              >
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div style={styles.avatarContainer}>
                    {artisan.profile_photo ? (
                      <img src={artisan.profile_photo} alt={artisan.username} style={styles.avatarImage} />
                    ) : (
                      <div style={styles.avatarPlaceholder}>
                        {artisan.username?.charAt(0).toUpperCase() || 'A'}
                      </div>
                    )}
                    {artisan.is_verified && (
                      <div style={styles.verifiedBadge}>
                        <CheckCircle size={12} />
                      </div>
                    )}
                  </div>
                  <div style={styles.cardTitleArea}>
                    <h3 style={styles.cardTitle}>{artisan.username}</h3>
                    <p style={styles.cardSubtitle}>{artisan.service_category}</p>
                  </div>
                  <div style={styles.ratingBadge}>
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span>{artisan.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <MapPin size={14} color="#6b7280" />
                    <span style={styles.infoText}>{artisan.location || 'Location not specified'}</span>
                  </div>
                  <p style={styles.bio}>{artisan.bio || 'No bio available'}</p>
                  
                  {artisan.skills && (
                    <div style={styles.skillsContainer}>
                      {artisan.skills.split(',').slice(0, 3).map((skill, index) => (
                        <span key={index} style={styles.skillBadge}>{skill.trim()}</span>
                      ))}
                      {artisan.skills.split(',').length > 3 && (
                        <span style={styles.skillBadgeMore}>+{artisan.skills.split(',').length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div style={styles.cardFooter}>
                  <div style={styles.statsRow}>
                    <div style={styles.stat}>
                      <Clock size={14} color="#6b7280" />
                      <span style={styles.statText}>{artisan.experience_years || 0} years</span>
                    </div>
                    <div style={styles.stat}>
                      <Award size={14} color="#6b7280" />
                      <span style={styles.statText}>{artisan.hourly_rate ? `Ksh ${artisan.hourly_rate}/hr` : 'Rate N/A'}</span>
                    </div>
                  </div>
                  <button
                    style={styles.bookButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookClick(artisan);
                    }}
                  >
                    Book Now
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div style={styles.modalOverlay} onClick={() => setShowBookingForm(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Book {selectedArtisan?.username}</h2>
              <button style={styles.modalClose} onClick={() => setShowBookingForm(false)}>×</button>
            </div>
            <div style={styles.modalBody}>
              <form onSubmit={handleBookingSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Service Type *</label>
                  <select
                    name="service_category"
                    value={bookingFormData.service_category}
                    onChange={handleBookingChange}
                    style={styles.formSelect}
                    required
                  >
                    <option value="">Select service...</option>
                    <option value={selectedArtisan?.service_category}>{selectedArtisan?.service_category}</option>
                    <option value="General Repairs">General Repairs</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Your Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={bookingFormData.location}
                    onChange={handleBookingChange}
                    style={styles.formInput}
                    placeholder="Where do you need the service?"
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Preferred Date</label>
                    <input
                      type="date"
                      name="preferred_date"
                      value={bookingFormData.preferred_date}
                      onChange={handleBookingChange}
                      style={styles.formInput}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Budget (Ksh)</label>
                    <input
                      type="number"
                      name="budget"
                      value={bookingFormData.budget}
                      onChange={handleBookingChange}
                      style={styles.formInput}
                      placeholder="5000"
                      min="0"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Job Description *</label>
                  <textarea
                    name="description"
                    value={bookingFormData.description}
                    onChange={handleBookingChange}
                    style={styles.formTextarea}
                    placeholder="Describe what needs to be done..."
                    required
                  />
                </div>

                <div style={styles.formActions}>
                  <button
                    type="button"
                    style={styles.btnCancel}
                    onClick={() => setShowBookingForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      ...styles.btnSubmit,
                      opacity: submitting ? 0.7 : 1
                    }}
                  >
                    {submitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .search-row {
            flex-direction: column !important;
          }
          
          .grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
  },
  hero: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '48px 24px',
    textAlign: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 12px 0',
  },
  heroSubtitle: {
    color: '#94a3b8',
    fontSize: '18px',
    margin: 0,
  },
  searchContainer: {
    maxWidth: '1200px',
    margin: '-24px auto 32px',
    padding: '0 24px',
    position: 'relative',
    zIndex: 10,
  },
  searchBox: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  inputWrapper: {
    position: 'relative',
    flex: '1',
    minWidth: '200px',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    padding: '14px 14px 14px 44px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  selectInput: {
    padding: '14px 40px 14px 14px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    background: '#fff',
    cursor: 'pointer',
    minWidth: '160px',
    outline: 'none',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%236b7280\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    whiteSpace: 'nowrap',
  },
  resultsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px 48px',
  },
  loadingState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#6b7280',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: '#fff',
    borderRadius: '16px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '20px 20px 0',
  },
  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarImage: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '700',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '20px',
    height: '20px',
    background: '#10b981',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #fff',
    color: '#fff',
  },
  cardTitleArea: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 4px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: '#fef3c7',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#d97706',
  },
  cardBody: {
    padding: '16px 20px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
  },
  infoText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  bio: {
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.6',
    margin: '0 0 14px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  skillBadge: {
    padding: '5px 12px',
    background: '#e0e7ff',
    color: '#4f46e5',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  skillBadgeMore: {
    padding: '5px 12px',
    background: '#f3f4f6',
    color: '#6b7280',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  cardFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #f3f4f6',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  bookButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: '#fff',
    borderRadius: '16px',
    maxWidth: '520px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
  },
  modalBody: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  formInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  formSelect: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    background: '#fff',
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box',
  },
  formTextarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  btnCancel: {
    flex: 1,
    padding: '12px',
    background: '#f3f4f6',
    color: '#4b5563',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSubmit: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ArtisanDirectory;

