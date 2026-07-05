import apiClient from './client'

export interface PhotographerProfile {
  id: number
  user: {
    id: number
    displayName: string
    avatarUrl?: string
    city?: string
    province?: string
  }
  bio?: string
  styles: string[]
  shootTypes: string[]
  priceRangeMin: number
  priceRangeMax: number
  serviceArea: string[]
  ratingAvg: number
  bookingCount: number
  status: string
}

export const photographerApi = {
  search: (params: {
    province?: string
    city?: string
    styles?: string
    shootTypes?: string
    priceMin?: number
    priceMax?: number
    sortBy?: string
    page?: number
    size?: number
  }) => apiClient.get('/photographers', { params }),

  getProfile: (id: number) =>
    apiClient.get<{ success: boolean; data: PhotographerProfile }>(`/photographers/${id}`),

  getMyProfile: () =>
    apiClient.get<{ success: boolean; data: PhotographerProfile }>('/photographers/me'),

  apply: (data: any) =>
    apiClient.post('/photographers/apply', data),
}
