import apiClient from './client'

export interface Booking {
  id: number
  client: { id: number; displayName: string }
  photographer: { id: number; displayName: string; city?: string }
  shootType: string
  shootDate: string
  timeSlot: string
  location: string
  description: string
  price: number
  status: string
  clientNote?: string
  photographerNote?: string
  createdAt: string
}

export interface PhotographerSchedule {
  id: number
  scheduleDate: string
  timeSlot: string
  isAvailable: boolean
  booking?: { id: number }
}

export const bookingApi = {
  create: (data: {
    photographerId: number
    shootType: string
    shootDate: string
    timeSlot: string
    location: string
    description: string
    price?: number
  }) => apiClient.post('/bookings', data),

  list: (role: 'client' | 'photographer', page = 0) =>
    apiClient.get<{ success: boolean; data: { content: Booking[] } }>(
      `/bookings?role=${role}&page=${page}`
    ),

  detail: (id: number) =>
    apiClient.get<{ success: boolean; data: Booking }>(`/bookings/${id}`),

  updateStatus: (id: number, status: string, note?: string) =>
    apiClient.put(`/bookings/${id}/status`, { status, note }),

  getSchedule: (photographerId: number, start: string, end: string) =>
    apiClient.get<{ success: boolean; data: PhotographerSchedule[] }>(
      `/schedules/${photographerId}?start=${start}&end=${end}`
    ),

  setAvailability: (date: string, timeSlot: string, isAvailable: boolean) =>
    apiClient.put('/schedules', { date, timeSlot, isAvailable }),
}
