/**
 * =============================================================================
 * STOCKFLOW API SERVICE - LỚP KẾT NỐI DỮ LIỆU CHUẨN RESTFUL
 * =============================================================================
 * Tệp này đóng vai trò là "Bộ điều hợp" (Adapter) giữa Giao diện người dùng (Frontend)
 * và Máy chủ (Backend).
 *
 * HIỆN TẠI (Giai đoạn chỉ có Frontend):
 * - USE_REAL_BACKEND = false
 * - Mọi hàm đều trả về Promise (async/await) lấy và lưu qua StockStore (LocalStorage).
 *
 * TƯƠNG LAI (Khi bạn viết thêm Server Node.js, Spring Boot, Python, PHP...):
 * - Chỉ cần đổi USE_REAL_BACKEND = true
 * - Điền BASE_URL máy chủ của bạn (ví dụ: 'http://localhost:5000/api')
 * - Toàn bộ mã nguồn trên tất cả các trang HTML giữ nguyên 100%, không cần viết lại giao diện!
 * =============================================================================
 */

const API_CONFIG = {
  // Đổi thành true khi bạn đã khởi chạy Server Backend thật
  USE_REAL_BACKEND: false,

  // Địa chỉ gốc của API Server khi có backend
  BASE_URL: 'http://localhost:5000/api',

  // Khóa lưu JWT Token trên trình duyệt
  TOKEN_KEY: 'stockflow_token'
};

const StockAPI = {
  // ===========================================================================
  // 1. XÁC THỰC VÀ TÀI KHOẢN (AUTH & USER PROFILE)
  // ===========================================================================
  auth: {
    // Đăng nhập tài khoản
    async login(email, password) {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) localStorage.setItem(API_CONFIG.TOKEN_KEY, data.token);
        return data;
      }

      // Mock LocalStorage
      const users = StockStore.getNhanSu();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) throw new Error('Email hoặc mật khẩu không chính xác');
      
      const sessionUser = {
        id: user.id,
        ten: user.ten,
        email: user.email,
        vaiTro: user.vaiTro,
        chucDanh: user.phongBan
      };
      StockStore.setCurrentUser(sessionUser);
      StockStore.ghiNhatKy('ĐĂNG NHẬP', 'Auth', `Người dùng ${user.ten} đăng nhập hệ thống`);
      return { success: true, token: 'mock_jwt_token_' + Date.now(), user: sessionUser };
    },

    // Lấy thông tin người dùng phiên làm việc hiện tại
    async getProfile() {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return await res.json();
      }
      return StockStore.getCurrentUser();
    },

    // Đăng xuất
    async logout() {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);
      StockStore.ghiNhatKy('ĐĂNG XUẤT', 'Auth', 'Người dùng đăng xuất phiên làm việc');
      return { success: true };
    }
  },

  // ===========================================================================
  // 2. HÀNG HÓA VÀ TỒN KHO (PRODUCTS & INVENTORY)
  // ===========================================================================
  products: {
    // Lấy danh sách hàng hóa (hỗ trợ tìm kiếm & lọc danh mục)
    async getAll(params = {}) {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_CONFIG.BASE_URL}/products?${query}`);
        return await res.json();
      }

      let list = StockStore.getSanPham();
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => p.sku.toLowerCase().includes(q) || p.ten.toLowerCase().includes(q));
      }
      if (params.category && params.category !== 'tat-ca') {
        list = list.filter(p => p.danhMuc === params.category);
      }
      return { success: true, data: list };
    },

    // Thêm mới sản phẩm
    async create(newProduct) {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct)
        });
        return await res.json();
      }

      const list = StockStore.getSanPham();
      const product = {
        id: 'p_' + Date.now(),
        ...newProduct,
        soLuong: Number(newProduct.soLuong) || 0,
        dinhMucToiThieu: Number(newProduct.dinhMucToiThieu) || 10,
        giaNhap: Number(newProduct.giaNhap) || 0,
        giaXuat: Number(newProduct.giaXuat) || 0
      };
      list.unshift(product);
      StockStore.setSanPham(list);
      StockStore.ghiNhatKy('THÊM HÀNG HÓA', product.sku, `Thêm sản phẩm mới: ${product.ten}`);
      return { success: true, data: product };
    },

    // Cập nhật sản phẩm
    async update(id, updatedData) {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
        return await res.json();
      }

      const list = StockStore.getSanPham();
      const idx = list.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Không tìm thấy sản phẩm');
      
      list[idx] = { ...list[idx], ...updatedData };
      StockStore.setSanPham(list);
      StockStore.ghiNhatKy('CẬP NHẬT HÀNG HÓA', list[idx].sku, `Cập nhật thông tin: ${list[idx].ten}`);
      return { success: true, data: list[idx] };
    },

    // Xóa sản phẩm
    async delete(id) {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
          method: 'DELETE'
        });
        return await res.json();
      }

      let list = StockStore.getSanPham();
      const item = list.find(p => p.id === id);
      list = list.filter(p => p.id !== id);
      StockStore.setSanPham(list);
      if (item) {
        StockStore.ghiNhatKy('XÓA HÀNG HÓA', item.sku, `Đã xóa sản phẩm ${item.ten} khỏi danh mục`);
      }
      return { success: true, message: 'Đã xóa sản phẩm' };
    }
  },

  // ===========================================================================
  // 3. PHIẾU NHẬP - XUẤT KHO (STOCK MOVEMENTS)
  // ===========================================================================
  movements: {
    // Lấy toàn bộ phiếu
    async getAll() {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/movements`);
        return await res.json();
      }
      return { success: true, data: StockStore.getPhieu() };
    },

    // Tạo phiếu nhập kho
    async createInbound(data) {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/movements/inbound`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      }

      // Cập nhật tồn kho sản phẩm tương ứng
      const products = StockStore.getSanPham();
      const pIdx = products.findIndex(p => p.id === data.sanPhamId);
      if (pIdx !== -1) {
        products[pIdx].soLuong += Number(data.soLuong);
        StockStore.setSanPham(products);
      }

      // Lưu phiếu mới
      const phieuList = StockStore.getPhieu();
      const phieuMoi = {
        id: 'm_' + Date.now(),
        maPhieu: 'NK-' + new Date().getFullYear() + '-' + String(phieuList.length + 1).padStart(3, '0'),
        loai: 'nhap',
        doiTac: data.doiTac,
        tenHang: data.tenHang,
        soLuong: Number(data.soLuong),
        tongTien: Number(data.tongTien),
        thoiGian: new Date().toLocaleString('vi-VN'),
        nguoiLap: StockStore.getCurrentUser()?.ten || 'Thủ kho'
      };
      phieuList.unshift(phieuMoi);
      StockStore.setPhieu(phieuList);
      StockStore.ghiNhatKy('NHẬP KHO', phieuMoi.maPhieu, `Nhập ${data.soLuong} ${data.tenHang} từ ${data.doiTac}`);
      return { success: true, data: phieuMoi };
    },

    // Tạo phiếu xuất kho (có kiểm tra chống xuất âm)
    async createOutbound(data) {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/movements/outbound`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      }

      const products = StockStore.getSanPham();
      const pIdx = products.findIndex(p => p.id === data.sanPhamId);
      if (pIdx === -1) throw new Error('Không tìm thấy mặt hàng');
      if (products[pIdx].soLuong < Number(data.soLuong)) {
        throw new Error(`Số lượng tồn khả dụng không đủ! Hiện tại chỉ còn ${products[pIdx].soLuong}`);
      }

      products[pIdx].soLuong -= Number(data.soLuong);
      StockStore.setSanPham(products);

      const phieuList = StockStore.getPhieu();
      const phieuMoi = {
        id: 'm_' + Date.now(),
        maPhieu: 'XK-' + new Date().getFullYear() + '-' + String(phieuList.length + 1).padStart(3, '0'),
        loai: 'xuat',
        doiTac: data.doiTac,
        tenHang: data.tenHang,
        soLuong: Number(data.soLuong),
        tongTien: Number(data.tongTien),
        thoiGian: new Date().toLocaleString('vi-VN'),
        nguoiLap: StockStore.getCurrentUser()?.ten || 'Thủ kho'
      };
      phieuList.unshift(phieuMoi);
      StockStore.setPhieu(phieuList);
      StockStore.ghiNhatKy('XUẤT KHO', phieuMoi.maPhieu, `Xuất ${data.soLuong} ${data.tenHang} cho ${data.doiTac}`);
      return { success: true, data: phieuMoi };
    }
  },

  // ===========================================================================
  // 4. NHÀ CUNG CẤP & ĐỐI TÁC (SUPPLIERS)
  // ===========================================================================
  suppliers: {
    async getAll() {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/suppliers`);
        return await res.json();
      }
      return { success: true, data: StockStore.getNhaCungCap() };
    },

    async create(data) {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/suppliers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      }

      const list = StockStore.getNhaCungCap();
      const ncc = {
        id: 's_' + Date.now(),
        ma: data.ma || 'NCC-' + (list.length + 1).toString().padStart(3, '0'),
        ten: data.ten,
        nguoiLienHe: data.nguoiLienHe || 'Chưa cập nhật',
        dienThoai: data.dienThoai || '',
        email: data.email || '',
        diaChi: data.diaChi || '',
        congNo: Number(data.congNo) || 0,
        trangThai: 'active'
      };
      list.unshift(ncc);
      StockStore.setNhaCungCap(list);
      StockStore.ghiNhatKy('THÊM NHÀ CUNG CẤP', ncc.ma, `Thêm đối tác: ${ncc.ten}`);
      return { success: true, data: ncc };
    }
  },

  // ===========================================================================
  // 5. NHÂN SỰ & PHÂN QUYỀN (USERS & RBAC)
  // ===========================================================================
  users: {
    async getAll() {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/users`);
        return await res.json();
      }
      return { success: true, data: StockStore.getNhanSu() };
    },

    async updateRole(userId, newRole) {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}/role`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole })
        });
        return await res.json();
      }

      const list = StockStore.getNhanSu();
      const idx = list.findIndex(u => u.id === userId);
      if (idx === -1) throw new Error('Không tìm thấy người dùng');

      list[idx].vaiTro = newRole;
      StockStore.setNhanSu(list);
      StockStore.ghiNhatKy('PHÂN QUYỀN RBAC', list[idx].ten, `Cập nhật vai trò mới thành: ${newRole.toUpperCase()}`);
      return { success: true, data: list[idx] };
    }
  },

  // ===========================================================================
  // 6. NHẬT KÝ KIỂM TOÁN (AUDIT LOGS)
  // ===========================================================================
  audit: {
    async getAll() {
      if (API_CONFIG.USE_REAL_BACKEND) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/audit-logs`);
        return await res.json();
      }
      return { success: true, data: StockStore.getNhatKy() };
    }
  }
};
