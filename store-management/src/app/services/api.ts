/**
 * API Service for connecting frontend to MySQL backend
 * Handles all HTTP requests to the Express server
 */

// Get API URL from environment or use default
const getApiBaseUrl = (): string => {
  try {
    // @ts-ignore - Vite env variable
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  } catch {
    return 'http://localhost:5000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Helper function to get current user from localStorage
const getCurrentUser = (): any => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Helper function to set current user
const setCurrentUser = (user: any): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

// Helper function to remove current user
const removeCurrentUser = (): void => {
  localStorage.removeItem('currentUser');
};

// Generic fetch wrapper with error handling
const fetchAPI = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error or server unavailable');
  }
};

// Auth API endpoints
export const authAPI = {
  // Register a new customer
  registerCustomer: async (data: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    password: string;
    contact_number: string;
    address: string;
  }) => {
    return fetchAPI<{ message: string }>('/auth/register-customer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Register a new technician
  registerTechnician: async (data: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    password: string;
    contact_number: string;
    specialization: string;
    service_area?: string;
  }) => {
    return fetchAPI<{ message: string }>('/auth/register-technician', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },



  // Login
  login: async (data: { email: string; password: string }) => {
    try {
      const response = await fetchAPI<{
        message: string;
        token: string;
        role: string;
        user_id?: string | number;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      // Store token and user info on successful login
      if (response.token) {
        setAuthToken(response.token);
        const user = {
          email: data.email,
          role: response.role,
          id: response.user_id,
        };
        setCurrentUser(user);
      }
      
      return response;
    } catch (error) {
      console.error('[API] Login error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    return fetchAPI<{ user: any }>('/auth/me');
  },

  // Logout (clears local storage)
  logout: () => {
    removeAuthToken();
    removeCurrentUser();
  },
};

// Products API endpoints
export const productsAPI = {
  // Get all products
  getAllProducts: async () => {
    return fetchAPI<any[]>('/products', {
      method: 'GET',
    });
  },

  // List products with optional filters
  listProducts: async (filters?: {
    category?: string;
    store_id?: number;
    limit?: number;
    offset?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.store_id) params.append('store_id', String(filters.store_id));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    const queryString = params.toString();
    const endpoint = `/products${queryString ? '?' + queryString : ''}`;

    return fetchAPI<any[]>(endpoint, { method: 'GET' });
  },

  // Get product by ID
  getProductById: async (id: string | number) => {
    return fetchAPI<any>(`/products/${id}`, {
      method: 'GET',
    });
  },

  // Search products
  searchProducts: async (query: string) => {
    return fetchAPI<any[]>(`/products/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  },

  // Create a new product
  createProduct: async (data: {
    store_id: number;
    part_name: string;
    part_number?: string;
    category: string;
    description: string;
    price: number;
    stock_quantity: number;
    compatibility?: string;
    status?: string;
  }) => {
    return fetchAPI<{ part_id: number; message: string }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a product
  updateProduct: async (
    id: number | string,
    data: {
      part_name?: string;
      part_number?: string;
      category?: string;
      description?: string;
      price?: number;
      stock_quantity?: number;
      compatibility?: string;
      status?: string;
    }
  ) => {
    return fetchAPI<{ message: string }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a product
  deleteProduct: async (id: number | string) => {
    return fetchAPI<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Update stock (delta - increment/decrement)
  updateStock: async (productId: number | string, delta: number) => {
    return fetchAPI<{ message: string }>(`/products/${productId}/stock`, {
      method: 'POST',
      body: JSON.stringify({ delta }),
    });
  },
};

// Services API endpoints
export const servicesAPI = {
  // Get all services (with optional filtering)
  getAllServices: async (params?: {
    customer_id?: string;
    technician_id?: string;
    store_id?: string;
    status?: string;
    my_requests?: string;
  }) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `/services?${queryString}` : '/services';
    return fetchAPI<any[]>(url, {
      method: 'GET',
    });
  },

  // Get services by category
  getServicesByCategory: async (category: string) => {
    return fetchAPI<any[]>(`/services/category/${encodeURIComponent(category)}`, {
      method: 'GET',
    });
  },

  // Get service request by ID
  getServiceById: async (id: string) => {
    return fetchAPI<any>(`/services/${id}`, {
      method: 'GET',
    });
  },

  // Create a new service request
  createServiceRequest: async (data: {
    customer_id?: number;
    technician_id?: number;
    store_id?: number;
    service_id?: number;
    appliance_id?: number;
    service_address: string;
    issue_description: string;
    appointment_date: string;
    status?: string;
  }) => {
    return fetchAPI<{ message: string; service_request_id: number }>(`/services`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Assign technician to a service request
  assignTechnician: async (id: string, technician_id: number) => {
    return fetchAPI<{ message: string }>(`/services/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ technician_id }),
    });
  },

  // Update service request status
  updateServiceStatus: async (id: string, status: string) => {
    return fetchAPI<{ message: string }>(`/services/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get service requests for a specific store (for store owners)
  getStoreServiceRequests: async (storeId: string, status?: string) => {
    const queryString = status ? `?status=${encodeURIComponent(status)}` : '';
    return fetchAPI<any[]>(`/services/store/${storeId}${queryString}`, {
      method: 'GET',
    });
  },

  // Delete a service request
  deleteServiceRequest: async (id: string) => {
    return fetchAPI<{ message: string }>(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API endpoints
export const ordersAPI = {
  // Create a new order
  createOrder: async (data: {
    customer_id: string;
    products?: Array<{ product_id: string; quantity: number }>;
    service_id?: string;
    total_amount: number;
    status?: string;
  }) => {
    return fetchAPI<{ message: string; order_id: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get orders by customer ID
  getOrdersByCustomerId: async (customerId: string) => {
    return fetchAPI<any[]>(`/orders/customer/${customerId}`, {
      method: 'GET',
    });
  },

  // Get orders by store ID (for store owners)
  getOrdersByStoreId: async (storeId: string) => {
    return fetchAPI<any[]>(`/orders/store/${storeId}`, {
      method: 'GET',
    });
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string) => {
    return fetchAPI<{ message: string }>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Users API endpoints
export const usersAPI = {
  // Get all users (admin only)
  getAllUsers: async () => {
    return fetchAPI<any[]>('/users', {
      method: 'GET',
    });
  },

  // Get pending applications (admin only)
  getPendingApplications: async () => {
    return fetchAPI<any[]>('/users/pending', {
      method: 'GET',
    });
  },

  // Approve user application
  approveUser: async (userId: string, role: string) => {
    return fetchAPI<{ message: string }>(`/users/${userId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  // Reject user application
  rejectUser: async (userId: string, role: string) => {
    return fetchAPI<{ message: string }>(`/users/${userId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
};

// Notifications API endpoints
export const notificationsAPI = {
  // Get notifications for current user
  getNotifications: async () => {
    return fetchAPI<any[]>('/notifications', {
      method: 'GET',
    });
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    return fetchAPI<{ message: string }>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },
};

// Stores API endpoints
export const storesAPI = {
  // Get all stores (with optional filtering)
  getAllStores: async (params?: { owner_id?: string; search?: string; type?: string }) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `/stores?${queryString}` : '/stores';
    return fetchAPI<any[]>(url, {
      method: 'GET',
    });
  },

  // Get stores owned by the current user (for store owners)
  getMyStores: async () => {
    return fetchAPI<any[]>('/stores/my-stores', {
      method: 'GET',
    });
  },

  // Get store by ID
  getStoreById: async (id: string) => {
    return fetchAPI<any>(`/stores/${id}`, {
      method: 'GET',
    });
  },

  // Create a new store
  createStore: async (data: {
    store_name: string;
    store_type?: string;
    store_address: string;
    store_owner_id?: number;
  }) => {
    return fetchAPI<{ message: string; store_id: number }>(`/stores`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a store
  updateStore: async (id: string, data: {
    store_name?: string;
    store_type?: string;
    store_address?: string;
  }) => {
    return fetchAPI<{ message: string }>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a store
  deleteStore: async (id: string) => {
    return fetchAPI<{ message: string }>(`/stores/${id}`, {
      method: 'DELETE',
    });
  },

  // Get products by store
  getProductsByStore: async (storeId: string) => {
    return fetchAPI<any[]>(`/stores/${storeId}/products`, {
      method: 'GET',
    });
  },


};

// Admin API endpoints
export const adminAPI = {
  // Get pending technicians
  getPendingTechnicians: async () => {
    return fetchAPI<any[]>('/admin/pending/technicians', {
      method: 'GET',
    });
  },



  // Get rejected technicians
  getRejectedTechnicians: async () => {
    return fetchAPI<any[]>('/admin/rejected/technicians', {
      method: 'GET',
    });
  },



  // Approve technician
  approveTechnician: async (technicianId: string) => {
    return fetchAPI<{ message: string }>(`/admin/approve/technician/${technicianId}`, {
      method: 'PUT',
    });
  },



  // Reject technician
  rejectTechnician: async (technicianId: string) => {
    return fetchAPI<{ message: string }>(`/admin/reject/technician/${technicianId}`, {
      method: 'PUT',
    });
  },


};

// Export helper functions for use in components
export {
  fetchAPI,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
};