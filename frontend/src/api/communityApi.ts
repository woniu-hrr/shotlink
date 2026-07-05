import apiClient from './client'

export interface CommunityPost {
  id: number
  user: { id: number; displayName: string; avatarUrl?: string }
  title: string
  content: string
  category: string
  tags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  isFeatured: boolean
  createdAt: string
}

export interface CommunityComment {
  id: number
  user: { id: number; displayName: string }
  post: { id: number }
  parent?: { id: number }
  content: string
  likeCount: number
  createdAt: string
}

export const communityApi = {
  getPosts: (category?: string, page = 0) =>
    apiClient.get<{ success: boolean; data: { content: CommunityPost[] } }>(
      `/posts?${category ? `category=${category}&` : ''}page=${page}`
    ),

  getPost: (id: number) =>
    apiClient.get<{ success: boolean; data: CommunityPost }>(`/posts/${id}`),

  createPost: (data: { title: string; content: string; category?: string; tags?: string[] }) =>
    apiClient.post('/posts', data),

  deletePost: (id: number) => apiClient.delete(`/posts/${id}`),

  getComments: (postId: number) =>
    apiClient.get<{ success: boolean; data: CommunityComment[] }>(`/posts/${postId}/comments`),

  addComment: (postId: number, content: string, parentId?: number) =>
    apiClient.post(`/posts/${postId}/comments`, { content, parentId }),

  toggleLike: (targetType: string, targetId: number) =>
    apiClient.post<{ success: boolean; data: { liked: boolean } }>('/likes', { targetType, targetId }),

  checkLike: (targetType: string, targetId: number) =>
    apiClient.get<{ success: boolean; data: { liked: boolean } }>(
      `/likes/check?targetType=${targetType}&targetId=${targetId}`
    ),
}
