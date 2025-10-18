import apiService from './api';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

class AuthService {
  async login(credentials: LoginCredentials) {
    const response = await apiService.post<AuthResponse>('/auth/login/', credentials);
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  }

  async register(data: RegisterData) {
    const response = await apiService.post<AuthResponse>('/auth/register/', data);
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  }

  logout() {
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
    return apiService.get<User>('/auth/profile/');
  }

  async updateProfile(data: Partial<User>) {
    return apiService.put<User>('/auth/profile/', data);
  }

  async requestPasswordReset(email: string) {
    return apiService.post('/auth/password-reset/', { email });
  }
}

export const authService = new AuthService();
export default authService;

