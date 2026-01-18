const API_BASE_URL = 'https://juaconnect-api.onrender.com/v1';
const USE_MOCK_API = false;

const getToken = () => {
  return localStorage.getItem('token');
};

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const removeToken = () => {
  localStorage.removeItem('token');
};

const setUserType = (userType) => {
  localStorage.setItem('user_type', userType);
};

const getUserType = () => {
  return localStorage.getItem('user_type');
};

// Mock API for testing when backend is unavailable
const mockApi = {
  // Track current logged in user
  _currentUserEmail: null,
  
  // Mock artisans database for search
  _artisans: [
    {
      id: 101,
      username: 'John Carpenter',
      email: 'john@juaconnect.com',
      user_type: 'artisan',
      phone: '0712345678',
      location: 'Nairobi',
      service_category: 'Carpentry',
      experience_years: 8,
      bio: 'Expert carpenter with over 8 years of experience in furniture making and repairs.',
      rating: 4.8,
      is_verified: true,
      skills: 'Furniture,Doors,Windows,Cabinets',
      hourly_rate: 1500,
      languages: 'English,Swahili',
      service_area: 'Nairobi,Kasarani,Westlands'
    },
    {
      id: 102,
      username: 'Mary Plumber',
      email: 'mary@juaconnect.com',
      user_type: 'artisan',
      phone: '0723456789',
      location: 'Nairobi',
      service_category: 'Plumbing',
      experience_years: 5,
      bio: 'Licensed plumber specializing in residential and commercial plumbing services.',
      rating: 4.6,
      is_verified: true,
      skills: 'Pipes,Leak Repair,Installation',
      hourly_rate: 1200,
      languages: 'English,Swahili',
      service_area: 'Nairobi,Kilimani,Parklands'
    },
    {
      id: 103,
      username: 'Ahmed Electric',
      email: 'ahmed@juaconnect.com',
      user_type: 'artisan',
      phone: '0734567890',
      location: 'Mombasa',
      service_category: 'Electrical',
      experience_years: 10,
      bio: 'Certified electrician with a decade of experience in all electrical works.',
      rating: 4.9,
      is_verified: true,
      skills: 'Wiring,Lighting,Panel Installation',
      hourly_rate: 1800,
      languages: 'English,Swahili,Arabic',
      service_area: 'Mombasa,Nairobi'
    },
    {
      id: 104,
      username: 'Peter Mason',
      email: 'peter@juaconnect.com',
      user_type: 'artisan',
      phone: '0745678901',
      location: 'Kisumu',
      service_category: 'Masonry',
      experience_years: 6,
      bio: 'Skilled mason specializing in brickwork, tiling, and concrete works.',
      rating: 4.5,
      is_verified: true,
      skills: 'Brickwork,Tiling,Concrete',
      hourly_rate: 1300,
      languages: 'English,Swahili',
      service_area: 'Kisumu,Nairobi'
    },
    {
      id: 105,
      username: 'Sarah Welder',
      email: 'sarah@juaconnect.com',
      user_type: 'artisan',
      phone: '0756789012',
      location: 'Nairobi',
      service_category: 'Welding',
      experience_years: 7,
      bio: 'Professional welder experienced in structural and decorative metalwork.',
      rating: 4.7,
      is_verified: true,
      skills: 'MIG,TIG,Structural,Decorative',
      hourly_rate: 1600,
      languages: 'English,Swahili',
      service_area: 'Nairobi,Thika'
    }
  ],
  
  login: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user database
    const mockUsers = {
      'artisan@test.com': { password: 'artisan123', user_type: 'artisan', name: 'John Doe' },
      'client@test.com': { password: 'client123', user_type: 'client', name: 'Jane Smith' },
    };

    const user = mockUsers[email];
    if (user && user.password === password) {
      const mockToken = 'mock_token_' + Date.now();
      setToken(mockToken);
      setUserType(user.user_type);
      // Store the email for profile lookup
      mockApi._currentUserEmail = email;
      return {
        success: true,
        data: {
          token: mockToken,
          user: {
            user_type: user.user_type,
            name: user.name,
            email: email
          }
        },
        message: 'Login successful'
      };
    }
    return {
      success: false,
      message: `Invalid credentials. Test accounts:\n\nArtisan: artisan@test.com / artisan123\nClient: client@test.com / client123`,
      data: null
    };
  },

  register: async (userData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockToken = 'mock_token_' + Date.now();
    setToken(mockToken);
    setUserType(userData.user_type);
    
    // If registering as artisan, add to _artisans array
    if (userData.user_type === 'artisan') {
      mockApi._currentUserEmail = userData.email;
      const newArtisan = {
        id: mockApi._artisans.length + 106,
        username: userData.username,
        email: userData.email,
        user_type: 'artisan',
        phone: userData.phone || '',
        location: userData.location || '',
        service_category: userData.service_category || '',
        experience_years: userData.experience_years || 0,
        bio: userData.bio || '',
        rating: 0,
        is_verified: false,
        skills: userData.skills || '',
        hourly_rate: userData.hourly_rate || null,
        languages: userData.languages || '',
        service_area: userData.service_area || ''
      };
      mockApi._artisans.push(newArtisan);
    }
    
    return {
      success: true,
      data: {
        token: mockToken,
        user: {
          user_type: userData.user_type,
          name: userData.username,
          email: userData.email
        }
      },
      message: 'Registration successful'
    };
  },

  // Mock notifications storage
  _notifications: [],
  _requests: [],

  // Initialize from localStorage
  initFromStorage() {
    try {
      const storedRequests = localStorage.getItem('mock_requests');
      if (storedRequests) {
        this._requests = JSON.parse(storedRequests);
      }
      const storedNotifications = localStorage.getItem('mock_notifications');
      if (storedNotifications) {
        this._notifications = JSON.parse(storedNotifications);
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
  },

  // Save to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('mock_requests', JSON.stringify(this._requests));
      localStorage.setItem('mock_notifications', JSON.stringify(this._notifications));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  },

  // Broadcast changes to other tabs
  broadcastChange() {
    try {
      const channel = new BroadcastChannel('juaconnect_channel');
      channel.postMessage({ type: 'data_update' });
    } catch (e) {
      console.error('BroadcastChannel error:', e);
    }
  },

  getNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    const userType = getUserType();
    const notifications = mockApi._notifications.filter(n => n.user_type === userType);
    return {
      success: true,
      data: notifications,
      unread_count: notifications.filter(n => !n.is_read).length
    };
  },

  getUnreadNotificationCount: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userType = getUserType();
    const count = mockApi._notifications.filter(n => n.user_type === userType && !n.is_read).length;
    return {
      success: true,
      data: { count }
    };
  },

  markNotificationAsRead: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const notification = mockApi._notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.is_read = true;
    }
    return { success: true };
  },

  markAllNotificationsAsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userType = getUserType();
    mockApi._notifications.forEach(n => {
      if (n.user_type === userType) n.is_read = true;
    });
    return { success: true };
  },

  deleteNotification: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockApi._notifications = mockApi._notifications.filter(n => n.id !== notificationId);
    return { success: true };
  },

  getMyRequests: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    console.log('getMyRequests - loaded from storage:', mockApi._requests);
    return {
      success: true,
      data: mockApi._requests.filter(r => r.status !== 'cancelled')
    };
  },

  createServiceRequest: async (requestData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    const newRequest = {
      id: mockApi._requests.length + 1,
      ...requestData,
      status: 'pending',
      created_at: new Date().toISOString(),
      client: { username: 'You', email: getUserType() },
      artisan: null
    };
    mockApi._requests.push(newRequest);
    mockApi.saveToStorage();
    mockApi.broadcastChange();
    return { success: true, data: newRequest };
  },

  getAvailableRequests: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    // Show all pending requests (both unassigned and assigned to this artisan)
    return {
      success: true,
      data: mockApi._requests.filter(r => r.status === 'pending')
    };
  },

  getAcceptedRequests: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    return {
      success: true,
      data: mockApi._requests.filter(r => r.status === 'accepted' || r.status === 'in_progress')
    };
  },

  acceptRequest: async (requestId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    const request = mockApi._requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'accepted';
      request.artisan = { username: 'John Doe' };
      mockApi.saveToStorage();
      mockApi.broadcastChange();
    }
    return { success: true, data: request };
  },

  rejectRequest: async (requestId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    const request = mockApi._requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'cancelled';
      mockApi.saveToStorage();
      mockApi.broadcastChange();
    }
    return { success: true, data: request };
  },

  startWork: async (requestId, totalAmount) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    const request = mockApi._requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'in_progress';
      mockApi.saveToStorage();
      mockApi.broadcastChange();
    }
    return { success: true };
  },

  completeWork: async (requestId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    const request = mockApi._requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'completed';
      mockApi.saveToStorage();
      mockApi.broadcastChange();
    }
    return { success: true };
  },

  getBookingRequests: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return requests assigned to artisans
    const bookingRequests = mockApi._requests.filter(r => r.artisan_id);
    return { success: true, data: bookingRequests };
  },

  // Artisan Profile Management (Mock)
  getArtisanProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Find artisan by current logged in email
    const artisan = mockApi._artisans.find(a => a.email === mockApi._currentUserEmail);
    if (artisan) {
      return { success: true, data: artisan };
    }
    // If not found, return a default template
    return {
      success: true,
      data: {
        id: 0,
        username: 'New Artisan',
        email: mockApi._currentUserEmail || 'artisan@test.com',
        user_type: 'artisan',
        phone: '',
        location: '',
        service_category: '',
        experience_years: 0,
        bio: '',
        rating: 0,
        is_verified: false,
        skills: '',
        hourly_rate: null,
        languages: '',
        service_area: ''
      }
    };
  },

  updateArtisanProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Find and update the current artisan by email
    const index = mockApi._artisans.findIndex(a => a.email === mockApi._currentUserEmail);
    if (index >= 0) {
      // Update existing artisan
      mockApi._artisans[index] = { ...mockApi._artisans[index], ...profileData };
      return {
        success: true,
        data: mockApi._artisans[index],
        message: 'Profile updated successfully'
      };
    }
    // If not found, return the data as is (for first-time profile)
    return {
      success: true,
      data: profileData,
      message: 'Profile updated successfully'
    };
  },

  getArtisanById: async (artisanId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const artisan = mockApi._artisans.find(a => a.id === parseInt(artisanId));
    if (artisan) {
      return { success: true, data: artisan };
    }
    return { success: false, message: 'Artisan not found' };
  },

  searchArtisans: async (serviceCategory, location) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let results = mockApi._artisans.filter(a => a.is_verified);
    
    if (serviceCategory) {
      results = results.filter(a => 
        a.service_category.toLowerCase().includes(serviceCategory.toLowerCase())
      );
    }
    
    if (location) {
      results = results.filter(a => 
        a.location.toLowerCase().includes(location.toLowerCase()) ||
        (a.service_area && a.service_area.toLowerCase().includes(location.toLowerCase()))
      );
    }
    
    return { success: true, data: results };
  },

  bookArtisanDirect: async (bookingData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApi.initFromStorage();
    const { artisan_id, service_category, description, location, budget } = bookingData;
    
    const newRequest = {
      id: mockApi._requests.length + 1,
      client_id: Date.now(),
      artisan_id: artisan_id,
      artisan: mockApi._artisans.find(a => a.id === artisan_id),
      service_category: service_category,
      description: description,
      location: location,
      budget: budget,
      status: 'pending',
      created_at: new Date().toISOString(),
      client: { username: 'You' }
    };
    
    mockApi._requests.push(newRequest);
    mockApi.saveToStorage();
    mockApi.broadcastChange();
    
    // Add notification for the artisan
    mockApi._notifications.push({
      id: mockApi._notifications.length + 1,
      user_type: 'artisan',
      title: 'New Booking Request',
      message: `A client has requested your services for ${service_category}.`,
      notification_type: 'booking',
      related_id: newRequest.id,
      is_read: false,
      created_at: new Date().toISOString()
    });
    mockApi.saveToStorage();
    mockApi.broadcastChange();
    
    return {
      success: true,
      data: newRequest,
      message: 'Booking request sent successfully!'
    };
  }
};

const api = {
  // Auth
  register: async (userData) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.register(userData);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return {
          success: false,
          message: `HTTP Error: ${response.status}`,
          data: null
        };
      }
      
      const data = await response.json();
      if (data.success && data.data && data.data.token) {
        setToken(data.data.token);
        setUserType(data.data.user.user_type);
      }
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timeout. The backend API server is not responding.',
          data: null
        };
      }
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  },

  login: async (email, password) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.login(email, password);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return {
          success: false,
          message: `HTTP Error: ${response.status}`,
          data: null
        };
      }
      
      const data = await response.json();
      if (data.success && data.data && data.data.token) {
        setToken(data.data.token);
        setUserType(data.data.user.user_type);
      }
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timeout. The backend API server is not responding.',
          data: null
        };
      }
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  },

  logout: () => {
    removeToken();
    localStorage.removeItem('user_type');
  },

  getUserType: getUserType,

  // User Profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData)
    });
    return await response.json();
  },

  // Client Service Requests
  createServiceRequest: async (requestData) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.createServiceRequest(requestData);
    }

    const response = await fetch(`${API_BASE_URL}/client/requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    return await response.json();
  },

  getMyRequests: async () => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.getMyRequests();
    }

    const response = await fetch(`${API_BASE_URL}/client/requests`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  getRequestDetail: async (id) => {
    const response = await fetch(`${API_BASE_URL}/client/requests/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  cancelRequest: async (id) => {
    const response = await fetch(`${API_BASE_URL}/client/requests/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'cancelled' })
    });
    return await response.json();
  },

  getMyBookings: async () => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: []
      };
    }

    const response = await fetch(`${API_BASE_URL}/client/bookings`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  // Artisan Endpoints
  getAvailableRequests: async () => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.getAvailableRequests();
    }

    const response = await fetch(`${API_BASE_URL}/artisan/available-requests`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  getAcceptedRequests: async () => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.getAcceptedRequests();
    }

    const response = await fetch(`${API_BASE_URL}/artisan/accepted-requests`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  acceptRequest: async (requestId) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.acceptRequest(requestId);
    }

    const response = await fetch(`${API_BASE_URL}/artisan/requests/${requestId}/accept`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  },

  rejectRequest: async (requestId) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.rejectRequest(requestId);
    }

    const response = await fetch(`${API_BASE_URL}/artisan/requests/${requestId}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  },

  startWork: async (requestId, totalAmount) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.startWork(requestId, totalAmount);
    }

    const response = await fetch(`${API_BASE_URL}/artisan/requests/${requestId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ total_amount: totalAmount })
    });
    return await response.json();
  },

  completeWork: async (requestId) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.completeWork(requestId);
    }

    const response = await fetch(`${API_BASE_URL}/artisan/requests/${requestId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  },

  searchArtisans: async (serviceCategory, location) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.searchArtisans(serviceCategory, location);
    }

    const params = new URLSearchParams();
    if (serviceCategory) params.append('service_category', serviceCategory);
    if (location) params.append('location', location);
    
    const response = await fetch(`${API_BASE_URL}/artisan/search?${params.toString()}`);
    return await response.json();
  },

  // Artisan Profile
  getArtisanProfile: async () => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.getArtisanProfile();
    }

    const response = await fetch(`${API_BASE_URL}/artisan/profile`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  updateArtisanProfile: async (profileData) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.updateArtisanProfile(profileData);
    }

    const response = await fetch(`${API_BASE_URL}/artisan/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData)
    });
    return await response.json();
  },

  getArtisanById: async (artisanId) => {
    const response = await fetch(`${API_BASE_URL}/artisan/${artisanId}`);
    return await response.json();
  },

  bookArtisanDirect: async (bookingData) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.bookArtisanDirect(bookingData);
    }

    const response = await fetch(`${API_BASE_URL}/client/book-artisan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    return await response.json();
  },

  // Notifications
  getNotifications: async () => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.getNotifications();
    }

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  getUnreadNotificationCount: async () => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.getUnreadNotificationCount();
    }

    const response = await fetch(`${API_BASE_URL}/notifications/unread`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  markNotificationAsRead: async (notificationId) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.markNotificationAsRead(notificationId);
    }

    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  },

  markAllNotificationsAsRead: async () => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.markAllNotificationsAsRead();
    }

    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  },

  deleteNotification: async (notificationId) => {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockApi.deleteNotification(notificationId);
    }

    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return await response.json();
  },

  // Legacy methods (kept for compatibility)
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/client/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    return await response.json();
  },

  getBookings: async (status = null) => {
    return await api.getMyBookings();
  },

  getBooking: async (id) => {
    return await api.getRequestDetail(id);
  },

  getBookingRequests: async () => {
    return await api.getAvailableRequests();
  },

  getActiveJobs: async () => {
    return await api.getAcceptedRequests();
  },

  acceptBooking: async (bookingId) => {
    return await api.acceptRequest(bookingId);
  },

  completeJob: async (bookingId) => {
    return await api.completeWork(bookingId);
  }
};

export default api;

