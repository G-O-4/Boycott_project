import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  const url = config.url ?? '';
  const isAuth = url.includes('/auth/login') || url.includes('/auth/register');

  // لا نرسل Authorization في login/register
  if (!isAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (isAuth && config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});


// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    displayName: string;
    displayNameAr?: string;
    city?: string;
    language?: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),

  updateProfile: (data: Partial<{
    displayName: string;
    displayNameAr: string;
    city: string;
    language: string;
    avatar: string;
  }>) => api.patch('/auth/me', data),
};

// Products API
export const productsApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; verdict?: string }) =>
    api.get('/products', { params }),

  getByBarcode: (barcode: string) =>
    api.get(`/products/barcode/${barcode}`),

  getById: (id: string) =>
    api.get(`/products/${id}`),

  getAlternatives: (id: string, city?: string) =>
    api.get(`/products/${id}/alternatives`, { params: { city } }),

  getClaims: (id: string) =>
    api.get(`/products/${id}/claims`),

  recordScan: (id: string, sessionId?: string) =>
    api.post(`/products/${id}/scan`, { sessionId }),

  getTrending: (limit?: number) =>
    api.get('/products/trending', { params: { limit } }),

  getStats: () =>
    api.get('/products/stats'),
};

// Companies API
export const companiesApi = {
  getAll: (params?: { page?: number; limit?: number; verdict?: string; search?: string }) =>
    api.get('/companies', { params }),

  getById: (id: string) =>
    api.get(`/companies/${id}`),

  getOwnership: (id: string) =>
    api.get(`/companies/${id}/ownership`),

  getBrands: (id: string) =>
    api.get(`/companies/${id}/brands`),

  getProducts: (id: string, params?: { page?: number; limit?: number }) =>
    api.get(`/companies/${id}/products`, { params }),
};

// Alternatives API
export const alternativesApi = {
  getByProduct: (productId: string, city?: string) =>
    api.get(`/alternatives/product/${productId}`, { params: { city } }),

  getByCategory: (categoryId: string, params?: { city?: string; page?: number; limit?: number }) =>
    api.get(`/alternatives/category/${categoryId}`, { params }),

  getTop: (params?: { city?: string; limit?: number }) =>
    api.get('/alternatives/top', { params }),

  getRecent: (limit?: number) =>
    api.get('/alternatives/recent', { params: { limit } }),
};

// Stores API
export const storesApi = {
  getAll: (params?: { page?: number; limit?: number; city?: string; tags?: string }) =>
    api.get('/stores', { params }),

  getById: (id: string) =>
    api.get(`/stores/${id}`),

  getByCity: (city: string, params?: { area?: string; tags?: string }) =>
    api.get(`/stores/city/${city}`, { params }),

  getForProduct: (alternativeId: string, params?: { city?: string; sortBy?: string }) =>
    api.get(`/stores/product/${alternativeId}`, { params }),

  confirmAvailability: (data: { storeId: string; alternativeId: string; isAvailable: boolean }) =>
    api.post('/stores/confirm', data),

  updatePrice: (data: { storeId: string; alternativeId: string; priceMin: number; priceMax: number; currency?: string }) =>
    api.post('/stores/price', data),
};

// Search API
export const searchApi = {
  searchAll: (q: string, limit?: number) =>
    api.get('/search', { params: { q, limit } }),

  searchProducts: (params: { q?: string; category?: string; verdict?: string; page?: number; limit?: number }) =>
    api.get('/search/products', { params }),

  searchCompanies: (params: { q?: string; verdict?: string; page?: number; limit?: number }) =>
    api.get('/search/companies', { params }),

  searchBrands: (params: { q?: string; companyId?: string; page?: number; limit?: number }) =>
    api.get('/search/brands', { params }),

  getCategories: () =>
    api.get('/search/categories'),
};

// Submissions API
export const submissionsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; targetType?: string }) =>
    api.get('/submissions', { params }),

  getById: (id: string) =>
    api.get(`/submissions/${id}`),

  getMine: (params?: { page?: number; limit?: number }) =>
    api.get('/submissions/user/mine', { params }),

  create: (data: {
    targetType: string;
    targetId?: string;
    proposedData: Record<string, unknown>;
    evidenceSources: string[];
    proposedAlternatives?: unknown[];
    proposedStores?: unknown[];
  }) => api.post('/submissions', data),

  vote: (id: string, data: { voteType: string; note?: string }) =>
    api.post(`/submissions/${id}/vote`, data),
};

// Users API
export const usersApi = {
  getProfile: (id: string) =>
    api.get(`/users/${id}`),

  getStats: (id: string) =>
    api.get(`/users/${id}/stats`),

  getBadges: (id: string) =>
    api.get(`/users/${id}/badges`),

  getLeaderboard: (params?: { limit?: number; period?: string }) =>
    api.get('/users/leaderboard', { params }),

  getActivity: (id: string, params?: { limit?: number }) =>
    api.get(`/users/${id}/activity`, { params }),
};

export default api;

