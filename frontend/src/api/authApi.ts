import apiClient from './client'

interface RegisterData {
  email: string
  password: string
  displayName: string
  role: 'CLIENT' | 'PHOTOGRAPHER'
  phone?: string
  city?: string
  province?: string
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  userId: number
  email: string
  displayName: string
  role: 'CLIENT' | 'PHOTOGRAPHER' | 'ADMIN'
  tokenType: string
}

export const authApi = {
  register: (data: RegisterData) =>
    apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/register', data),

  login: (data: LoginData) =>
    apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', data),

  refresh: (refreshToken: string) =>
    apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/refresh', { refreshToken }),

  logout: () => apiClient.post<{ success: boolean }>('/auth/logout'),
}

export type { RegisterData, LoginData, AuthResponse }
