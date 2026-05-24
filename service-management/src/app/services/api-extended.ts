/**
 * Extended API Service for all database-connected resources
 * This file extends the existing api.ts with products, services, and orders
 * 
 * Add this to: src/app/services/api.ts (after the existing code)
 */

import { fetchAPI } from './api';

// ============================================================================
// PRODUCTS API
// ============================================================================

export const productsAPI = {
  /**
   * Get all products with optional filters
   * GET /api/products?category=Refrigerator&store_id=1&limit=50&offset=0
   */
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

  /**
   * Get a single product by ID
   * GET /api/products/:id
   */
  getProductById: async (id: number) => {
    return fetchAPI<any>(`/products/${id}`, { method: 'GET' });
  },

  /**
   * Create a new product (requires authentication + store_owner/admin role)
   * POST /api/products
   */
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

  /**
   * Update a product
   * PUT /api/products/:id
   */
  updateProduct: async (
    id: number,
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

  /**
   * Delete a product
   * DELETE /api/products/:id
   */
  deleteProduct: async (id: number) => {
    return fetchAPI<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update product stock (increment/decrement)
   * POST /api/products/:id/stock
   * delta: positive to add, negative to subtract
   */
  updateStock: async (productId: number, delta: number) => {
    return fetchAPI<{ message: string }>(`/products/${productId}/stock`, {
      method: 'POST',
      body: JSON.stringify({ delta }),
    });
  },

  /**
   * Upload product image
   * POST /api/products/:id/images
   */
  uploadImage: async (productId: number, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/images`,
        {
          method: 'POST',
          headers,
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      return data;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to upload image');
    }
  },
};

// ============================================================================
// SERVICES API
// ============================================================================

export const servicesAPI = {
  /**
   * Get all services with optional filters
   * GET /api/services?technician_id=1&status=Available
   */
  listServices: async (filters?: {
    technician_id?: number;
    status?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.technician_id)
      params.append('technician_id', String(filters.technician_id));
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = `/services${queryString ? '?' + queryString : ''}`;

    return fetchAPI<any[]>(endpoint, { method: 'GET' });
  },

  /**
   * Get a single service by ID
   * GET /api/services/:id
   */
  getServiceById: async (id: number) => {
    return fetchAPI<any>(`/services/${id}`, { method: 'GET' });
  },

  /**
   * Create a new service
   * POST /api/services
   */
  createService: async (data: {
    technician_id: number;
    service_type: string;
    description?: string;
    price?: number;
  }) => {
    return fetchAPI<{ service_id: number; message: string }>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a service
   * PUT /api/services/:id
   */
  updateService: async (
    id: number,
    data: {
      service_type?: string;
      description?: string;
      price?: number;
    }
  ) => {
    return fetchAPI<{ message: string }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a service
   * DELETE /api/services/:id
   */
  deleteService: async (id: number) => {
    return fetchAPI<{ message: string }>(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// ORDERS API
// ============================================================================

export const ordersAPI = {
  /**
   * Get all orders with optional filters
   * GET /api/orders?customer_id=1&status=Pending
   */
  listOrders: async (filters?: {
    customer_id?: number;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.customer_id)
      params.append('customer_id', String(filters.customer_id));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    const queryString = params.toString();
    const endpoint = `/orders${queryString ? '?' + queryString : ''}`;

    return fetchAPI<any[]>(endpoint, { method: 'GET' });
  },

  /**
   * Get a single order by ID
   * GET /api/orders/:id
   */
  getOrderById: async (id: number) => {
    return fetchAPI<any>(`/orders/${id}`, { method: 'GET' });
  },

  /**
   * Create a new order
   * POST /api/orders
   */
  createOrder: async (data: {
    customer_id: number;
    items: Array<{
      product_id: number;
      quantity: number;
      price: number;
    }>;
  }) => {
    return fetchAPI<{ order_id: number; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update order status
   * PUT /api/orders/:id
   */
  updateOrderStatus: async (
    id: number,
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  ) => {
    return fetchAPI<{ message: string }>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// ============================================================================
// TECHNICIANS API
// ============================================================================

export const techniciansAPI = {
  /**
   * Get all technicians with optional filters
   * GET /api/technicians?status=Approved&specialization=Refrigerator
   */
  listTechnicians: async (filters?: {
    status?: 'Pending' | 'Approved' | 'Rejected';
    specialization?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.specialization)
      params.append('specialization', filters.specialization);

    const queryString = params.toString();
    const endpoint = `/technicians${queryString ? '?' + queryString : ''}`;

    return fetchAPI<any[]>(endpoint, { method: 'GET' });
  },

  /**
   * Get a single technician by ID
   * GET /api/technicians/:id
   */
  getTechnicianById: async (id: number) => {
    return fetchAPI<any>(`/technicians/${id}`, { method: 'GET' });
  },

  /**
   * Get technician's services
   * GET /api/technicians/:id/services
   */
  getTechnicianServices: async (technicianId: number) => {
    return fetchAPI<any[]>(`/technicians/${technicianId}/services`, {
      method: 'GET',
    });
  },
};

// ============================================================================
// STORES API
// ============================================================================

export const storesAPI = {
  /**
   * Get all stores
   * GET /api/stores
   */
  listStores: async () => {
    return fetchAPI<any[]>('/stores', { method: 'GET' });
  },

  /**
   * Get a single store by ID
   * GET /api/stores/:id
   */
  getStoreById: async (id: number) => {
    return fetchAPI<any>(`/stores/${id}`, { method: 'GET' });
  },

  /**
   * Get store's products
   * GET /api/stores/:id/products
   */
  getStoreProducts: async (storeId: number) => {
    return fetchAPI<any[]>(`/stores/${storeId}/products`, { method: 'GET' });
  },
};

// ============================================================================
// CUSTOMERS API
// ============================================================================

export const customersAPI = {
  /**
   * Get customer profile
   * GET /api/customers/:id
   */
  getCustomerById: async (id: number) => {
    return fetchAPI<any>(`/customers/${id}`, { method: 'GET' });
  },

  /**
   * Update customer profile
   * PUT /api/customers/:id
   */
  updateCustomer: async (
    id: number,
    data: {
      first_name?: string;
      last_name?: string;
      contact_number?: string;
      address?: string;
    }
  ) => {
    return fetchAPI<{ message: string }>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// SERVICE REQUESTS API
// ============================================================================

export const serviceRequestsAPI = {
  /**
   * Get all service requests with optional filters
   * GET /api/service-requests?technician_id=1&status=Pending
   */
  listServiceRequests: async (filters?: {
    technician_id?: number;
    customer_id?: number;
    status?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.technician_id)
      params.append('technician_id', String(filters.technician_id));
    if (filters?.customer_id)
      params.append('customer_id', String(filters.customer_id));
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = `/service-requests${queryString ? '?' + queryString : ''}`;

    return fetchAPI<any[]>(endpoint, { method: 'GET' });
  },

  /**
   * Create a new service request (booking)
   * POST /api/service-requests
   */
  createServiceRequest: async (data: {
    customer_id: number | string;
    technician_id: number | string;
    appliance_id?: number | null;
    appliance_type?: string;
    problem_description: string;
    service_address: string;   // maps to service_address in DB
    scheduled_date: string;    // maps to scheduled_date in DB (YYYY-MM-DD)
    contact_name?: string;
    contact_number?: string;
    additional_instructions?: string;
  }) => {
    return fetchAPI<{ request_id: number; reference: string; message: string }>(
      '/service-requests',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Get a service request by ID
   * GET /api/service-requests/:id
   */
  getServiceRequestById: async (id: number) => {
    return fetchAPI<any>(`/service-requests/${id}`, { method: 'GET' });
  },

  /**
   * Update service request status
   * PUT /api/service-requests/:id
   */
  updateServiceRequest: async (
    id: number,
    data: {
      status?: string;
      notes?: string;
    }
  ) => {
    return fetchAPI<{ message: string }>(`/service-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// CONTACT API
// ============================================================================

export const contactAPI = {
  /**
   * Submit a contact form
   * POST /api/contact
   */
  submitContactForm: async (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    return fetchAPI<{ message: string; contact_id?: number }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
