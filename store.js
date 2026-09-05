// =============================================================================
// STOCKFLOW STORE - QUẢN LÝ DỮ LIỆU DÙNG CHUNG (SHARED LOCALSTORAGE)
// Dùng chung cho tất cả các trang HTML: dang-nhap, index, hang-hoa, nhap-xuat, nha-cung-cap, nhan-su, nhat-ky
// =============================================================================

const DULIEU_MAC_DINH = {
  nguoiDungHienTai: {
    id: 'u1',
    ten: 'Nguyễn Văn An',
    email: 'an.nguyen@khohang.vn',
    vaiTro: 'admin', // 'admin' | 'manager' | 'staff' | 'accountant'
    chucDanh: 'Giám Đốc Kho Vận'
  },
  danhSachNguoiDung: [
    { id: 'u1', ten: 'Nguyễn Văn An', email: 'an.nguyen@khohang.vn', dienThoai: '0912 345 678', vaiTro: 'admin', phongBan: 'Ban Giám Đốc', trangThai: 'active' },
    { id: 'u2', ten: 'Trần Thị Mai', email: 'mai.tran@khohang.vn', dienThoai: '0988 123 456', vaiTro: 'manager', phongBan: 'Quản lý Điều phối', trangThai: 'active' },
    { id: 'u3', ten: 'Lê Hoàng Nam', email: 'nam.le@khohang.vn', dienThoai: '0903 555 789', vaiTro: 'staff', phongBan: 'Kho Tổng Hà Nội', trangThai: 'active' },
    { id: 'u4', ten: 'Phạm Thu Trang', email: 'trang.pham@khohang.vn', dienThoai: '0977 444 333', vaiTro: 'accountant', phongBan: 'Kế toán Kho', trangThai: 'active' },
    { id: 'u5', ten: 'Đỗ Quốc Bảo', email: 'bao.do@khohang.vn', dienThoai: '0933 666 888', vaiTro: 'staff', phongBan: 'Kho Bình Dương', trangThai: 'inactive' }
  ],
  danhSachSanPham: [
    { id: 'p1', sku: 'SKU-IP15P-256', ten: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên', danhMuc: 'Điện thoại', kho: 'Kho Tổng Hà Nội', soLuong: 45, dinhMucToiThieu: 20, giaNhap: 27500000, giaXuat: 31990000, donVi: 'Chiếc', viTri: 'Kệ A1-03' },
    { id: 'p2', sku: 'SKU-MBPM3-14', ten: 'MacBook Pro 14 M3 Pro 18GB 512GB Space Black', danhMuc: 'Laptop', kho: 'Kho Tổng Hà Nội', soLuong: 12, dinhMucToiThieu: 15, giaNhap: 43000000, giaXuat: 48990000, donVi: 'Máy', viTri: 'Kệ A2-01' },
    { id: 'p3', sku: 'SKU-APM2-USB', ten: 'Tai nghe AirPods Pro Gen 2 Type-C', danhMuc: 'Phụ kiện', kho: 'Kho Chi nhánh Bình Dương', soLuong: 8, dinhMucToiThieu: 25, giaNhap: 4600000, giaXuat: 5490000, donVi: 'Hộp', viTri: 'Kệ B1-04' },
    { id: 'p4', sku: 'SKU-SS-S24U', ten: 'Samsung Galaxy S24 Ultra 12GB 512GB Xám Titan', danhMuc: 'Điện thoại', kho: 'Kho Chi nhánh Bình Dương', soLuong: 0, dinhMucToiThieu: 10, giaNhap: 25000000, giaXuat: 28990000, donVi: 'Chiếc', viTri: 'Kệ A3-02' },
    { id: 'p5', sku: 'SKU-SN-XM5', ten: 'Tai nghe Chống ồn Sony WH-1000XM5 Đen', danhMuc: 'Âm thanh', kho: 'Kho Đà Nẵng', soLuong: 34, dinhMucToiThieu: 15, giaNhap: 6200000, giaXuat: 7690000, donVi: 'Chiếc', viTri: 'Kệ C1-02' },
    { id: 'p6', sku: 'SKU-LOG-MX3S', ten: 'Chuột không dây Logitech MX Master 3S Graphite', danhMuc: 'Phụ kiện', kho: 'Kho Đà Nẵng', soLuong: 65, dinhMucToiThieu: 20, giaNhap: 1750000, giaXuat: 2290000, donVi: 'Cái', viTri: 'Kệ B2-05' },
    { id: 'p7', sku: 'SKU-DELL-U2724D', ten: 'Màn hình Dell UltraSharp U2724D 2K 120Hz IPS', danhMuc: 'Màn hình', kho: 'Kho Tổng Hà Nội', soLuong: 18, dinhMucToiThieu: 10, giaNhap: 8900000, giaXuat: 10500000, donVi: 'Thùng', viTri: 'Kệ D1-01' }
  ],
  danhSachPhieu: [
    { id: 'm1', maPhieu: 'NK-2026-001', loai: 'nhap', doiTac: 'Apple Distribution VN', tenHang: 'iPhone 15 Pro Max 256GB', soLuong: 50, tongTien: 1375000000, thoiGian: '08:30 02/09/2026', nguoiLap: 'Nguyễn Văn An' },
    { id: 'm2', maPhieu: 'XK-2026-001', loai: 'xuat', doiTac: 'Hệ thống CellphoneS', tenHang: 'iPhone 15 Pro Max 256GB', soLuong: 5, tongTien: 159950000, thoiGian: '10:15 03/09/2026', nguoiLap: 'Trần Thị Mai' },
    { id: 'm3', maPhieu: 'NK-2026-002', loai: 'nhap', doiTac: 'FPT Synnex', tenHang: 'Tai nghe AirPods Pro Gen 2', soLuong: 30, tongTien: 138000000, thoiGian: '14:00 03/09/2026', nguoiLap: 'Lê Hoàng Nam' },
    { id: 'm4', maPhieu: 'XK-2026-002', loai: 'xuat', doiTac: 'Đại lý Hoàng Hà Mobile', tenHang: 'Tai nghe AirPods Pro Gen 2', soLuong: 22, tongTien: 120780000, thoiGian: '09:45 04/09/2026', nguoiLap: 'Lê Hoàng Nam' }
  ],
  danhSachNhaCungCap: [
    { id: 's1', ma: 'NCC-APL-01', ten: 'Apple Distribution Vietnam LLC', nguoiLienHe: 'Mr. David Chen', dienThoai: '028 3822 9999', email: 'supply@apple.com.vn', diaChi: 'Tầng 25, Bitexco, Q.1, TP.HCM', congNo: 450000000, trangThai: 'active' },
    { id: 's2', ma: 'NCC-FPT-02', ten: 'Công ty Cổ phần Synnex FPT', nguoiLienHe: 'Bà Nguyễn Thu Hằng', dienThoai: '024 7300 6666', email: 'contact@synnexfpt.com', diaChi: 'Tòa nhà FPT, Cầu Giấy, Hà Nội', congNo: 120000000, trangThai: 'active' },
    { id: 's3', ma: 'NCC-DGW-03', ten: 'Digiworld Corporation (DGW)', nguoiLienHe: 'Ông Trần Minh Quân', dienThoai: '028 3929 1888', email: 'order@digiworld.com.vn', diaChi: '195 Cô Bắc, P. Cô Giang, Q.1, TP.HCM', congNo: 85000000, trangThai: 'active' },
    { id: 's4', ma: 'NCC-SMC-04', ten: 'Samsung Electronics Vietnam', nguoiLienHe: 'Kim Sang Woo', dienThoai: '024 3555 8888', email: 'b2b.vn@samsung.com', diaChi: 'Khu CN Yên Phong, Bắc Ninh', congNo: 0, trangThai: 'active' }
  ],
  nhatKyKiemToan: [
    { id: 'k1', thoiGian: '10:30:00 05/09/2026', nguoiThaoTac: 'Nguyễn Văn An', vaiTro: 'Quản trị viên', hanhDong: 'ĐĂNG NHẬP HỆ THỐNG', doiTuong: 'Hệ thống kho', chiTiet: 'Đăng nhập phiên làm việc ban sáng' },
    { id: 'k2', thoiGian: '09:45:12 04/09/2026', nguoiThaoTac: 'Lê Hoàng Nam', vaiTro: 'Thủ kho', hanhDong: 'XUẤT KHO', doiTuong: 'XK-2026-002', chiTiet: 'Xuất 22 hộp Tai nghe AirPods Pro Gen 2 cho Hoàng Hà Mobile' },
    { id: 'k3', thoiGian: '14:00:20 03/09/2026', nguoiThaoTac: 'Lê Hoàng Nam', vaiTro: 'Thủ kho', hanhDong: 'NHẬP KHO', doiTuong: 'NK-2026-002', chiTiet: 'Nhập 30 hộp Tai nghe AirPods Pro Gen 2 từ FPT Synnex' }
  ]
};

// Đọc dữ liệu từ localStorage
function docKho(key, giaTriMacDinh) {
  try {
    const raw = localStorage.getItem('stockflow_' + key);
    if (!raw) {
      localStorage.setItem('stockflow_' + key, JSON.stringify(giaTriMacDinh));
      return giaTriMacDinh;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Lỗi đọc kho:', e);
    return giaTriMacDinh;
  }
}

// Lưu dữ liệu vào localStorage
function ghiKho(key, data) {
  try {
    localStorage.setItem('stockflow_' + key, JSON.stringify(data));
  } catch (e) {
    console.error('Lỗi ghi kho:', e);
  }
}

// Đối tượng Store điều phối toàn cục
const StockStore = {
  // Lấy dữ liệu
  getSanPham() { return docKho('sanPham', DULIEU_MAC_DINH.danhSachSanPham); },
  setSanPham(list) { ghiKho('sanPham', list); },
  capNhatSanPham(id, thongTinMoi) {
    const list = this.getSanPham();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...thongTinMoi };
      this.setSanPham(list);
      return list[idx];
    }
    return null;
  },
  timSanPhamTheoId(id) {
    const list = this.getSanPham();
    return list.find(p => p.id === id) || null;
  },

  getPhieu() { return docKho('phieu', DULIEU_MAC_DINH.danhSachPhieu); },
  setPhieu(list) { ghiKho('phieu', list); },

  getNhaCungCap() { return docKho('ncc', DULIEU_MAC_DINH.danhSachNhaCungCap); },
  setNhaCungCap(list) { ghiKho('ncc', list); },

  getNhanSu() { return docKho('nhanSu', DULIEU_MAC_DINH.danhSachNguoiDung); },
  setNhanSu(list) { ghiKho('nhanSu', list); },

  getNhatKy() { return docKho('nhatKy', DULIEU_MAC_DINH.nhatKyKiemToan); },
  setNhatKy(list) { ghiKho('nhatKy', list); },

  getCurrentUser() { return docKho('currentUser', DULIEU_MAC_DINH.nguoiDungHienTai); },
  setCurrentUser(user) { ghiKho('currentUser', user); },

  // Ghi nhật ký tự động
  ghiNhatKy(hanhDong, doiTuong, chiTiet) {
    const user = this.getCurrentUser();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const vaiTroMap = {
      admin: 'Quản trị viên',
      manager: 'Quản lý kho',
      staff: 'Thủ kho',
      accountant: 'Kế toán'
    };
    const logMoi = {
      id: 'k_' + Date.now(),
      thoiGian: timeStr,
      nguoiThaoTac: user ? user.ten : 'Người dùng',
      vaiTro: user ? (vaiTroMap[user.vaiTro] || user.vaiTro) : 'Thủ kho',
      hanhDong,
      doiTuong,
      chiTiet
    };
    const logs = this.getNhatKy();
    logs.unshift(logMoi);
    this.setNhatKy(logs);
  },

  // Reset về dữ liệu mẫu ban đầu
  datLaiMacDinh() {
    this.setSanPham(DULIEU_MAC_DINH.danhSachSanPham);
    this.setPhieu(DULIEU_MAC_DINH.danhSachPhieu);
    this.setNhaCungCap(DULIEU_MAC_DINH.danhSachNhaCungCap);
    this.setNhanSu(DULIEU_MAC_DINH.danhSachNguoiDung);
    this.setNhatKy(DULIEU_MAC_DINH.nhatKyKiemToan);
    this.setCurrentUser(DULIEU_MAC_DINH.nguoiDungHienTai);
  }
};

// Hàm định dạng tiền VNĐ
function dinhDangTien(soTien) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien || 0);
}

// Hàm format số lượng
function dinhDangSo(n) {
  return new Intl.NumberFormat('vi-VN').format(n || 0);
}
