import { apiCall, setAuthToken, removeAuthToken } from './api';
import { API_ENDPOINTS } from '../config/api';
import { User, ApiResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface SetRoleData {
  role: 'PATIENT' | 'DOCTOR';
  specialty?: string;
  experience?: number;
  credentialUrl?: string;
  description?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiCall<{ user: User; token: string }>(
      'POST',
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    if (response.success && response.data?.token) {
      await setAuthToken(response.data.token);
    }
    
    return response;
  }
  
  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiCall<{ user: User; token: string }>(
      'POST',
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    if (response.success && response.data?.token) {
      await setAuthToken(response.data.token);
    }
    
    return response;
  }
  
  async getProfile(): Promise<ApiResponse<User>> {
    return apiCall<User>('GET', API_ENDPOINTS.AUTH.PROFILE);
  }
  
  async setUserRole(data: SetRoleData): Promise<ApiResponse<{ user: User; redirect: string }>> {
    return apiCall<{ user: User; redirect: string }>(
      'POST',
      API_ENDPOINTS.USERS.UPDATE_ROLE,
      data
    );
  }
  
  async logout(): Promise<void> {
    await removeAuthToken();
  }
}

export const authService = new AuthService();