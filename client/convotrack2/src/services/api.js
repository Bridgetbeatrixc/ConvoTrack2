// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making API request to:', url, {
    method: options.method || 'GET',
    headers: options.headers
  });
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // For DELETE requests with no body, remove Content-Type header
  if (options.method === 'DELETE') {
    delete requestOptions.headers['Content-Type'];
    delete requestOptions.body;
  }

  console.log('Request options:', {
    method: requestOptions.method,
    headers: requestOptions.headers,
    credentials: requestOptions.credentials
  });

  try {
    const response = await fetch(url, requestOptions);
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      console.log('Received 204 No Content response');
      return { success: true };
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP error! status: ${response.status}`,
        message: response.statusText 
      }));
      console.error('API Error:', errorData);
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
    }
    
    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    }
    return { success: true };
    
  } catch (error) {
    console.error('API Request Error:', {
      message: error.message,
      stack: error.stack,
      url,
      method: options.method || 'GET'
    });
    throw error;
  }
}

// Authentication API
export const authAPI = {
  async login(email, password) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(userData) {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async logout() {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  async getProfile() {
    return apiRequest('/auth/profile');
  },

  async updateProfile(profileData) {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async changePassword(passwordData) {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },
};

// AI Agents API
export const agentsAPI = {
  async getAgents(params = {}) {
    const queryString = new URLSearchParams({ 
      ...params, 
      userId: 'demo-user' 
    }).toString();
    const endpoint = queryString ? `/agents?${queryString}` : '/agents?userId=demo-user';
    return apiRequest(endpoint);
  },

  async getAgent(id) {
    return apiRequest(`/agents/${id}`);
  },

  async createAgent(agentData) {
    return apiRequest('/agents', {
      method: 'POST',
      body: JSON.stringify({
        ...agentData,
        userId: 'demo-user'
      }),
    });
  },

  async updateAgent(id, agentData) {
    return apiRequest(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    });
  },

  async deleteAgent(id) {
    return apiRequest(`/agents/${id}`, {
      method: 'DELETE',
    });
  },

  async generateBehavior(businessDescription) {
    return apiRequest('/agents/generate-behavior', {
      method: 'POST',
      body: JSON.stringify({ businessDescription }),
    });
  },

  async getAgentStats(id) {
    return apiRequest(`/agents/${id}/stats`);
  },

  // Knowledge Base API
  async uploadDocument(agentId, formData) {
    // For FormData, we need to completely omit headers to let browser set them
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}/knowledge/upload`, {
      method: 'POST',
      body: formData,
      // Don't set any headers for FormData - browser will set multipart/form-data automatically
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getKnowledgeDocuments(agentId) {
    return apiRequest(`/agents/${agentId}/knowledge`);
  },

  async deleteKnowledgeDocument(agentId, documentId) {
    return apiRequest(`/agents/${agentId}/knowledge/${documentId}`, {
      method: 'DELETE'
    });
  },

  async searchKnowledgeBase(agentId, searchTerm) {
    return apiRequest(`/agents/${agentId}/knowledge/search?q=${encodeURIComponent(searchTerm)}`);
  }
};

// Chat API
export const chatAPI = {
  // Create new chat session
  createSession: async (data) => {
    return apiRequest('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        userId: 'demo-user'
      })
    });
  },

  // Get all chat sessions
  getSessions: async (params = {}) => {
    const queryString = new URLSearchParams({ 
      ...params, 
      userId: 'demo-user' 
    }).toString();
    const endpoint = queryString ? `/chat/sessions?${queryString}` : '/chat/sessions';
    return apiRequest(endpoint);
  },

  // Get messages for a session
  getMessages: async (sessionId, params = {}) => {
    if (!sessionId) throw new Error('Session ID is required');
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/chat/sessions/${sessionId}/messages?${queryString}` : `/chat/sessions/${sessionId}/messages`;
    return apiRequest(endpoint);
  },

  // Send message in a session
  sendMessage: async (sessionId, data) => {
    if (!sessionId) throw new Error('Session ID is required');
    return apiRequest(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Update session status
  updateSession: async (sessionId, data) => {
    if (!sessionId) throw new Error('Session ID is required');
    return apiRequest(`/chat/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Delete session
  deleteSession: async (sessionId) => {
    if (!sessionId) throw new Error('Session ID is required');
    return apiRequest(`/chat/sessions/${sessionId}`, {
      method: 'DELETE'
    });
  },

  async getSessionInsights(sessionId) {
    return apiRequest(`/chat/sessions/${sessionId}/insights`);
  },

  async getChatStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/chat/stats?${queryString}` : '/chat/stats';
    return apiRequest(endpoint);
  },
};

// Health check
export const healthAPI = {
  async check() {
    return apiRequest('/health');
  },
};

// Export default API object
export default {
  auth: authAPI,
  agents: agentsAPI,
  chat: chatAPI,
  health: healthAPI,
}; 