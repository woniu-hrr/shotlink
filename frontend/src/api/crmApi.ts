import apiClient from './client'

export interface DashboardStats {
  totalBookings: number
  totalClients: number
  pendingBookings: number
  totalRevenue: number
}

export const crmApi = {
  getDashboard: () => apiClient.get<{ success: boolean; data: DashboardStats }>('/crm/dashboard'),
  getClients: () => apiClient.get('/crm/clients'),

  // Contracts
  createContract: (data: any) => apiClient.post('/crm/contracts', data),
  getContracts: (page = 0) => apiClient.get(`/crm/contracts?page=${page}`),
  updateContractStatus: (id: number, status: string) =>
    apiClient.put(`/crm/contracts/${id}/status`, { status }),

  // Invoices
  createInvoice: (data: any) => apiClient.post('/crm/invoices', data),
  getInvoices: (page = 0) => apiClient.get(`/crm/invoices?page=${page}`),
  updateInvoiceStatus: (id: number, status: string) =>
    apiClient.put(`/crm/invoices/${id}/status`, { status }),

  // Deliveries
  createDelivery: (data: any) => apiClient.post('/crm/deliveries', data),
  getDeliveries: (page = 0) => apiClient.get(`/crm/deliveries?page=${page}`),
  updateDeliveryStatus: (id: number, status: string, note?: string) =>
    apiClient.put(`/crm/deliveries/${id}/status`, { status, note }),
}
