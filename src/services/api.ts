// Client API Service communicating with Backend Express & Database

const API_BASE = '';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Lỗi HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // DB Status & Reload & Sync
  async getDbStatus() {
    return request<{ status: string; data: any }>('/api/db/status');
  },

  async reloadDatabase() {
    return request<{ success: boolean; message: string; data: any }>('/api/db/reload', {
      method: 'POST'
    });
  },

  async syncDatabase(payload?: { filePath?: string; config?: any }) {
    return request<{ success: boolean; message: string; source?: string; counts?: any }>('/api/db/sync', {
      method: 'POST',
      body: JSON.stringify(payload || {})
    });
  },

  async connectMySql(config: { host?: string; user?: string; password?: string; database?: string; port?: number }) {
    return request<{ success: boolean; message: string }>('/api/db/connect', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  },

  async pushToMySql() {
    return request<{ success: boolean; message: string; counts?: any }>('/api/db/push', {
      method: 'POST'
    });
  },

  // Auth
  async login(email: string, password?: string) {
    return request<{ success: boolean; user: any; message?: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // Products
  async getProducts() {
    const res = await request<{ success: boolean; data: any[] }>('/api/products');
    return res.data;
  },

  async createProduct(product: any) {
    const res = await request<{ success: boolean; data: any }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
    return res.data;
  },

  async updateProduct(id: string, product: any) {
    return request<{ success: boolean }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
  },

  async deleteProduct(id: string) {
    return request<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Warehouses (Kho)
  async getWarehouses() {
    const res = await request<{ success: boolean; data: any[] }>('/api/warehouses');
    return res.data;
  },

  // Categories (Danh mục)
  async getCategories() {
    const res = await request<{ success: boolean; data: any[] }>('/api/categories');
    return res.data;
  },

  // Suppliers (Nhà cung cấp)
  async getSuppliers() {
    const res = await request<{ success: boolean; data: any[] }>('/api/suppliers');
    return res.data;
  },

  async createSupplier(supplier: any) {
    const res = await request<{ success: boolean; data: any }>('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier)
    });
    return res.data;
  },

  // Staff (Nhân viên)
  async getStaff() {
    const res = await request<{ success: boolean; data: any[] }>('/api/staff');
    return res.data;
  },

  async createStaff(staff: any) {
    const res = await request<{ success: boolean; data: any }>('/api/staff', {
      method: 'POST',
      body: JSON.stringify(staff)
    });
    return res.data;
  },

  async updateStaffRole(id: string, role: string) {
    return request<{ success: boolean }>(`/api/staff/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  },

  // Receipts (Phiếu hàng)
  async getReceipts() {
    const res = await request<{ success: boolean; data: any[] }>('/api/receipts');
    return res.data;
  },

  async createReceipt(receipt: any) {
    const res = await request<{ success: boolean; data: any }>('/api/receipts', {
      method: 'POST',
      body: JSON.stringify(receipt)
    });
    return res.data;
  },

  // Audit Logs
  async getAuditLogs() {
    const res = await request<{ success: boolean; data: any[] }>('/api/audit-logs');
    return res.data;
  },

  async addAuditLog(log: any) {
    return request<{ success: boolean }>('/api/audit-logs', {
      method: 'POST',
      body: JSON.stringify(log)
    });
  }
};
