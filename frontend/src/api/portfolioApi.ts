import apiClient from './client'

export interface PortfolioImage {
  id: number
  imageUrl: string
  thumbnailUrl: string
  width: number
  height: number
  fileName: string
  sortOrder: number
}

export interface Portfolio {
  id: number
  photographer: { id: number; displayName: string; avatarUrl?: string }
  title: string
  description: string
  shootType: string
  tags: string[]
  coverUrl: string
  imageCount: number
  viewCount: number
  likeCount: number
  images: PortfolioImage[]
  createdAt: string
}

export const portfolioApi = {
  list: (page = 0, size = 20) =>
    apiClient.get<{ success: boolean; data: { content: Portfolio[] } }>(
      `/portfolios?page=${page}&size=${size}`
    ),

  getDetail: (id: number) =>
    apiClient.get<{ success: boolean; data: Portfolio }>(`/portfolios/${id}`),

  getByPhotographer: (photographerId: number, page = 0, size = 20) =>
    apiClient.get<{ success: boolean; data: { content: Portfolio[] } }>(
      `/portfolios/photographer/${photographerId}?page=${page}&size=${size}`
    ),

  getPopular: () =>
    apiClient.get<{ success: boolean; data: Portfolio[] }>('/portfolios/popular'),

  create: (data: { title: string; description?: string; shootType?: string; tags?: string[] }) =>
    apiClient.post<{ success: boolean; data: Portfolio }>('/portfolios', data),

  uploadImage: (portfolioId: number, file: File, sortOrder?: number) => {
    const formData = new FormData()
    formData.append('file', file)
    if (sortOrder !== undefined) formData.append('sortOrder', String(sortOrder))
    return apiClient.post<{ success: boolean; data: PortfolioImage }>(
      `/portfolios/${portfolioId}/images`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  },

  delete: (id: number) => apiClient.delete(`/portfolios/${id}`),

  deleteImage: (imageId: number) => apiClient.delete(`/portfolios/images/${imageId}`),
}
