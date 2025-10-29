import apiService from './api';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

class AuthService {
  // NOTE: Authentication endpoints not yet implemented in backend
  // Backend will need to implement these under /api/accounts/ or /api/auth/
  
  async login(credentials: LoginCredentials) {
    // TODO: Backend needs to implement POST /api/accounts/auth/login/
    const response = await apiService.post<AuthResponse>('/accounts/auth/login/', credentials);
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  }

  async register(data: RegisterData) {
    // TODO: Backend needs to implement POST /api/accounts/auth/register/
    const response = await apiService.post<AuthResponse>('/accounts/auth/register/', data);
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  }

  async logout() {
    // TODO: Backend needs to implement POST /api/accounts/auth/logout/
    await apiService.post('/accounts/auth/logout/');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  async getProfile() {
    // TODO: Backend needs to implement GET /api/accounts/auth/me/ or /api/accounts/auth/profile/
    return apiService.get<User>('/accounts/auth/me/');
  }

  async updateProfile(data: Partial<User>) {
    // TODO: Backend needs to implement PATCH /api/accounts/auth/profile/
    return apiService.patch<User>('/accounts/auth/profile/', data);
  }

  async requestPasswordReset(email: string) {
    // TODO: Backend needs to implement POST /api/accounts/auth/password/reset/
    return apiService.post('/accounts/auth/password/reset/', { email });
  }

  async confirmPasswordReset(data: { token: string; password: string }) {
    // TODO: Backend needs to implement POST /api/accounts/auth/password/reset/confirm/
    return apiService.post('/accounts/auth/password/reset/confirm/', data);
  }
}

export const authService = new AuthService();
export default authService;

