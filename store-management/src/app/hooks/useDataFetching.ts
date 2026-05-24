/**
 * Custom React Hooks for API Data Fetching
 * These hooks handle loading states, errors, and automatic refetching
 * 
 * Place this file at: src/app/hooks/useDataFetching.ts
 */

import { useEffect, useState, useCallback } from 'react';
import { productsAPI, servicesAPI, ordersAPI, techniciansAPI, storesAPI } from '../services/api';

// ============================================================================
// Generic Hook Template (use as basis for other hooks)
// ============================================================================

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic hook for fetching data
 * Prevents race conditions and state updates after unmount
 */
const useDataFetch = <T,>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseDataState<T> & { refetch: () => void } => {
  const [state, setState] = useState<UseDataState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await fetchFn();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      });
    }
  }, [fetchFn]);

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const fetchData = async () => {
      try {
        const result = await fetchFn();
        if (isMounted) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch data',
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup
    };
  }, dependencies);

  return { ...state, refetch };
};

// ============================================================================
// PRODUCTS HOOKS
// ============================================================================

interface ProductFilters {
  category?: string;
  store_id?: number;
  limit?: number;
  offset?: number;
}

/**
 * Hook to fetch all products
 * Usage: const { data: products, loading, error } = useProducts({ category: 'Refrigerator' });
 */
export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsAPI.listProducts(filters);
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.store_id, filters?.limit, filters?.offset]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data: products, loading, error, refetch };
};

/**
 * Hook to fetch a single product by ID
 * Usage: const { data: product, loading, error } = useProductById(productId);
 */
export const useProductById = (productId: number | null) => {
  return useDataFetch(
    () => {
      if (!productId) return Promise.reject(new Error('Product ID required'));
      return productsAPI.getProductById(productId);
    },
    [productId]
  );
};

// ============================================================================
// SERVICES HOOKS
// ============================================================================

interface ServiceFilters {
  technician_id?: number;
  status?: string;
}

/**
 * Hook to fetch all services
 * Usage: const { data: services, loading, error } = useServices({ technician_id: 1 });
 */
export const useServices = (filters?: ServiceFilters) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicesAPI.listServices(filters);
      setServices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [filters?.technician_id, filters?.status]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data: services, loading, error, refetch };
};

/**
 * Hook to fetch a single service by ID
 * Usage: const { data: service, loading, error } = useServiceById(serviceId);
 */
export const useServiceById = (serviceId: number | null) => {
  return useDataFetch(
    () => {
      if (!serviceId) return Promise.reject(new Error('Service ID required'));
      return servicesAPI.getServiceById(serviceId);
    },
    [serviceId]
  );
};

// ============================================================================
// ORDERS HOOKS
// ============================================================================

interface OrderFilters {
  customer_id?: number;
  status?: string;
  limit?: number;
  offset?: number;
}

/**
 * Hook to fetch all orders
 * Usage: const { data: orders, loading, error } = useOrders({ customer_id: 1 });
 */
export const useOrders = (filters?: OrderFilters) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersAPI.listOrders(filters);
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [filters?.customer_id, filters?.status, filters?.limit, filters?.offset]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data: orders, loading, error, refetch };
};

/**
 * Hook to fetch a single order by ID
 * Usage: const { data: order, loading, error } = useOrderById(orderId);
 */
export const useOrderById = (orderId: number | null) => {
  return useDataFetch(
    () => {
      if (!orderId) return Promise.reject(new Error('Order ID required'));
      return ordersAPI.getOrderById(orderId);
    },
    [orderId]
  );
};

// ============================================================================
// TECHNICIANS HOOKS
// ============================================================================

interface TechnicianFilters {
  status?: 'Pending' | 'Approved' | 'Rejected';
  specialization?: string;
}

/**
 * Hook to fetch all technicians
 * Usage: const { data: technicians, loading, error } = useTechnicians({ status: 'Approved' });
 */
export const useTechnicians = (filters?: TechnicianFilters) => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await techniciansAPI.listTechnicians(filters);
      setTechnicians(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch technicians');
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.specialization]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data: technicians, loading, error, refetch };
};

/**
 * Hook to fetch a single technician by ID
 * Usage: const { data: technician, loading, error } = useTechnicianById(technicianId);
 */
export const useTechnicianById = (technicianId: number | null) => {
  return useDataFetch(
    () => {
      if (!technicianId) return Promise.reject(new Error('Technician ID required'));
      return techniciansAPI.getTechnicianById(technicianId);
    },
    [technicianId]
  );
};

/**
 * Hook to fetch a technician's services
 * Usage: const { data: services, loading, error } = useTechnicianServices(technicianId);
 */
export const useTechnicianServices = (technicianId: number | null) => {
  return useDataFetch(
    () => {
      if (!technicianId) return Promise.reject(new Error('Technician ID required'));
      return techniciansAPI.getTechnicianServices(technicianId);
    },
    [technicianId]
  );
};

// ============================================================================
// STORES HOOKS
// ============================================================================

/**
 * Hook to fetch all stores
 * Usage: const { data: stores, loading, error } = useStores();
 */
export const useStores = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storesAPI.listStores();
      setStores(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data: stores, loading, error, refetch };
};

/**
 * Hook to fetch a single store by ID
 * Usage: const { data: store, loading, error } = useStoreById(storeId);
 */
export const useStoreById = (storeId: number | null) => {
  return useDataFetch(
    () => {
      if (!storeId) return Promise.reject(new Error('Store ID required'));
      return storesAPI.getStoreById(storeId);
    },
    [storeId]
  );
};

/**
 * Hook to fetch a store's products
 * Usage: const { data: products, loading, error } = useStoreProducts(storeId);
 */
export const useStoreProducts = (storeId: number | null) => {
  return useDataFetch(
    () => {
      if (!storeId) return Promise.reject(new Error('Store ID required'));
      return storesAPI.getStoreProducts(storeId);
    },
    [storeId]
  );
};

// ============================================================================
// EXPORT ALL HOOKS
// ============================================================================

export const hooks = {
  // Products
  useProducts,
  useProductById,
  // Services
  useServices,
  useServiceById,
  // Orders
  useOrders,
  useOrderById,
  // Technicians
  useTechnicians,
  useTechnicianById,
  useTechnicianServices,
  // Stores
  useStores,
  useStoreById,
  useStoreProducts,
};
