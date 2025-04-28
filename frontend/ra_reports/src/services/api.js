export const API_BASE_URL = 'http://localhost:8083/api/v1';

// Function to clear all cookies
// const clearAllCookies = () => {
//   // Get all cookies and clear them one by one
//   const cookies = document.cookie.split(';');
  
//   for (let i = 0; i < cookies.length; i++) {
//     const cookie = cookies[i];
//     const eqPos = cookie.indexOf('=');
//     const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
//     // Set expiration to a past date to remove the cookie
//     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//   }
  
//   console.log('All cookies cleared');
// };

export const api = {
  async get(endpoint) {
    return this.request(endpoint, 'GET');
  },
  
  async post(endpoint, data) {
    return this.request(endpoint, 'POST', data);
  },
  
  async put(endpoint, data) {
    return this.request(endpoint, 'PUT', data);
  },
  
  async delete(endpoint) {
    return this.request(endpoint, 'DELETE');
  },
  
  async request(endpoint, method, data = null, 
    // raw = false
    ) {
    // for raw data, like PDF
    // const response = await fetch(`${API_BASE_URL}${endpoint}`, /*…*/);
    // if (!response.ok) throw new Error(response.statusText);
    // if (raw) return response;


    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
    };
//     const url = `${API_BASE_URL}${endpoint}`;
//   const options = {
//     method,
//     credentials: 'include',                    // always include cookies :contentReference[oaicite:6]{index=6}
//     headers: raw
//       ? {}                                      // no JSON parsing for raw
//       : { 'Content-Type': 'application/json' },// set header only for JSON :contentReference[oaicite:7]{index=7}
//     body: data && !raw
//       ? JSON.stringify(data)                   // stringify only for JSON
//       : data                                   // allow Blob/FormData for raw if needed
//   };

//   const response = await fetch(url, options);  // single fetch call :contentReference[oaicite:8]{index=8}
//   if (!response.ok) throw new Error(response.statusText);

//   if (raw) {
//     // Return native Response to enable .blob()
//     return response;                            // Response has blob(), arrayBuffer(), etc. :contentReference[oaicite:9]{index=9}
//   }

//   // JSON path
//   const text = await response.text();
//   return text ? JSON.parse(text) : {};
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      
      // Handle unauthorized or forbidden responses
      if (response.status === 401) {
        // Handle token expiration - attempt refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request
          return this.request(endpoint, method, data);
        } else {
          // If refresh fails, logout and clear cookies
          // await this.clearSessionAndRedirect();
          throw new Error('Session expired. Please login again.');
        }
      }
      
      // Handle forbidden (403) errors
      if (response.status === 403) {
        console.error('Access forbidden (403 error)');
        // Clear session data and redirect to login
        // await this.clearSessionAndRedirect();
        throw new Error('Access forbidden. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      
      // Handle empty response
      try {
        const text = await response.text();
        return text ? JSON.parse(text) : {};
      } catch (err) {
        return {};
      }
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
  
  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  },
  
  // Helper method to clear session and redirect to login
  // async clearSessionAndRedirect() {
  //   try {
  //     // First attempt to call the logout endpoint to let the server clear its session
  //     await fetch(`${API_BASE_URL}/auth/logout`, {
  //       method: 'POST',
  //       credentials: 'include',
  //     });
  //   } catch (error) {
  //     console.error('Server logout failed:', error);
  //     // Continue with client-side cleanup even if server logout fails
  //   } finally {
  //     // Clear all cookies
  //     // clearAllCookies();
      
  //     // Clear localStorage
  //     localStorage.removeItem('user');
      
  //     // Redirect to login page
  //     window.location.href = '/login';
  //   }
  // },
  
  async logout() {
    try {
      // await this.clearSessionAndRedirect();
    } catch (error) {
      console.error('Logout failed:', error);
      // Ensure redirect happens even if there's an error
      window.location.href = '/login';
    }
  },
  
  // Authentication specific methods
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      try {
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
      } catch (err) {
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      try {
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
      } catch (err) {
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  async getUserProfile() {
    // Since we don't have a /user/profile endpoint, 
    // we'll use the stored user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    } else {
      throw new Error('User profile not found');
    }
  }
};

export default api; 