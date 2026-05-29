import axios from 'axios';
import Cookies from 'js-cookie';

// API Base URL (env dosyasından veya varsayılan localhost)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek Interceptor'ı (Her istek gönderilmeden önce çalışır)
api.interceptors.request.use(
  (config) => {
    // Cookie'den token'ı al
    const token = Cookies.get('token');
    if (token) {
      // Varsa header'a ekle (Bearer Token)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt Interceptor'ı (Her yanıt geldiğinde çalışır)
api.interceptors.response.use(
  (response) => {
    // Return a successful response back to the calling service
    return response;
  },
  (error) => {
    // 401 Hatası (Yetkisiz Erişim) gelirse kullanıcıyı log out yapabiliriz
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Metotları
export const authApi = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email); // OAuth2 standardı gereği 'username' gönderiyoruz
    formData.append('password', password);
    const response = await api.post('/auth/login/access-token', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }, // Form data olduğu için
    });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    Cookies.remove('token');
    window.location.href = '/auth/login';
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.patch('/auth/me', userData);
    return response.data;
  },
  verifyIdentity: async (identityData) => {
    const response = await api.post('/auth/me/verify-identity', identityData);
    return response.data;
  },
  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/auth/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export const walletApi = {
  getAnalytics: async (id) => {
    const response = await api.get(`/wallets/${id}/analytics`);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/wallets/');
    return response.data;
  },
  create: async (walletData) => {
    const response = await api.post('/wallets/', walletData);
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/wallets/${id}`);
    return response.data;
  },
  update: async (id, walletData) => {
    const response = await api.put(`/wallets/${id}`, walletData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/wallets/${id}`);
    return response.data;
  }
};

export const searchApi = {
  globalSearch: async (query) => {
    const response = await api.get('/search/', { params: { query } });
    return response.data;
  }
};

export const statsApi = {
  getOverview: async () => {
    const response = await api.get('/stats/');
    return response.data;
  }
};

export const reportsApi = {
  getReports: async (period) => {
    const response = await api.get('/reports/', { params: { period } });
    return response.data;
  }
};

export const transactionApi = {
  getAll: async (params) => {
    const response = await api.get('/transactions/', { params });
    return response.data;
  },
  create: async (transactionData) => {
    const response = await api.post('/transactions/', transactionData);
    return response.data;
  }
};

export const budgetApi = {
  getAll: async () => {
    const response = await api.get('/budgets/');
    return response.data; // Returns list of budgets with 'spent' calculated
  },
  getInsights: async () => {
    const response = await api.get('/budgets/insights');
    return response.data;
  },
  create: async (budgetData) => {
    const response = await api.post('/budgets/', budgetData);
    return response.data;
  },
  update: async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  }
};

export const goalApi = {
  getAll: async () => {
    const response = await api.get('/goals/');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },
  create: async (goalData) => {
    const response = await api.post('/goals/', goalData);
    return response.data;
  },
  update: async (id, goalData) => {
    const response = await api.patch(`/goals/${id}`, goalData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

export const billApi = {
  getHistory: async () => {
    const response = await api.get('/bills/history');
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/bills/');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },
  create: async (billData) => {
    const response = await api.post('/bills/', billData);
    return response.data;
  },
  update: async (id, billData) => {
    const response = await api.patch(`/bills/${id}`, billData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  }
};

export const notificationApi = {
  getAll: async (params) => {
    const response = await api.get('/notifications/', { params });
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};


export const paymentMethodApi = {
  getAll: async () => {
    const response = await api.get('/payment-methods/');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/payment-methods/', data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/payment-methods/${id}`);
    return response.data;
  }
};
export default api;


