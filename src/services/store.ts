import {
  CurrentUser,
  NhaCungCap,
  NhatKy,
  PhieuHang,
  PhieuTrangThai,
  RoleConfig,
  SanPham,
  User,
  UserRole,
} from '../types';

export const PHAN_QUYEN_HE_THONG: Record<UserRole, RoleConfig> = {
  admin: {
    ten: 'Admin',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    trangDuocPhep: ['tong-quan', 'hang-hoa', 'nhap-kho', 'xuat-kho', 'nha-cung-cap', 'nhan-su', 'nhat-ky'],
    moTa: 'Toàn quyền 100%: Quản lý hàng hóa, xuất nhập tồn, tài chính, đối tác và phân quyền nhân sự'
  },
  manager: {
    ten: 'Quản lý',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    trangDuocPhep: ['tong-quan', 'hang-hoa', 'nhap-kho', 'xuat-kho', 'nha-cung-cap', 'nhat-ky'],
    moTa: 'Điều hành kho, duyệt phiếu, theo dõi đối tác NCC & kiểm tra nhật ký kiểm toán'
  },
  staff: {
    ten: 'Thủ kho',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    trangDuocPhep: ['tong-quan', 'hang-hoa', 'nhap-kho', 'xuat-kho'],
    moTa: 'Thực hiện kiểm đếm vị trí kệ kho, lập phiếu nhập hàng, xuất kho hàng ngày'
  },
  accountant: {
    ten: 'Kế toán kho',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    trangDuocPhep: ['tong-quan', 'hang-hoa', 'nhap-kho', 'xuat-kho', 'nha-cung-cap'],
    moTa: 'Xem giá vốn, kiểm soát phiếu nhập xuất và theo dõi công nợ nhà cung cấp'
  },
  supervisor: {
    ten: 'Giám sát',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    trangDuocPhep: ['tong-quan', 'hang-hoa', 'nhap-kho', 'xuat-kho', 'nhat-ky'],
    moTa: 'Giám sát hoạt động xuất nhập kho, quy trình kho vận và lịch sử kiểm toán'
  },
  employee: {
    ten: 'Nhân viên',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    trangDuocPhep: ['tong-quan', 'hang-hoa'],
    moTa: 'Tra cứu danh mục sản phẩm, vị trí kệ hàng và kiểm tra tồn kho khả dụng'
  }
};

export const DULIEU_MAC_DINH = {
  nguoiDungHienTai: {
    id: 'NV001',
    ten: 'Ngô Thị Hương',
    email: 'ngothihuong1@stockflow.vn',
    vaiTro: 'admin' as UserRole,
    chucDanh: 'Quản trị viên (Admin)'
  },
  danhSachNguoiDung: [
    { id: 'NV001', ten: 'Ngô Thị Hương', email: 'ngothihuong1@stockflow.vn', dienThoai: '0694644927', vaiTro: 'admin' as UserRole, phongBan: 'Ban Quản Trị', trangThai: 'active' as const },
    { id: 'NV002', ten: 'Đỗ Anh Khang', email: 'doanhkhang2@stockflow.vn', dienThoai: '0729417229', vaiTro: 'admin' as UserRole, phongBan: 'Ban Quản Trị', trangThai: 'active' as const },
    { id: 'NV004', ten: 'Đặng Văn Phong', email: 'dangvanphong4@stockflow.vn', dienThoai: '0369314647', vaiTro: 'manager' as UserRole, phongBan: 'Quản lý Điều phối', trangThai: 'active' as const },
    { id: 'NV009', ten: 'Hồ Quốc An', email: 'hoquocan9@stockflow.vn', dienThoai: '0977038636', vaiTro: 'staff' as UserRole, phongBan: 'Kho Tổng', trangThai: 'active' as const },
    { id: 'NV034', ten: 'Đỗ Thành Bình', email: 'dothanhbinh34@stockflow.vn', dienThoai: '0754021160', vaiTro: 'accountant' as UserRole, phongBan: 'Kế toán Kho', trangThai: 'active' as const }
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
    { 
      id: 'm1', 
      maPhieu: 'NK-2026-001', 
      loai: 'nhap' as const, 
      trangThai: 'thanh_cong' as const,
      dvVanChuyen: 'Giao Hàng Nhanh (GHN)',
      maVanDon: 'GHN8829103VN',
      doiTac: 'Apple Distribution VN', 
      kho: 'Kho Tổng Hà Nội',
      tenHang: 'iPhone 15 Pro Max, Tai nghe AirPods Pro', 
      soLuong: 50, 
      tongTien: 1146000000, 
      thoiGian: '08:30 02/09/2026', 
      nguoiLap: 'Ngô Thị Hương',
      ghiChu: 'Nhập lô hàng linh kiện & thiết bị Apple chính hãng',
      danhSachHang: [
        { spId: 'p1', sku: 'SKU-IP15P-256', ten: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên', donVi: 'Chiếc', soLuong: 40, donGia: 27500000, thanhTien: 1100000000 },
        { spId: 'p3', sku: 'SKU-APM2-USB', ten: 'Tai nghe AirPods Pro Gen 2 Type-C', donVi: 'Hộp', soLuong: 10, donGia: 4600000, thanhTien: 46000000 }
      ]
    },
    { 
      id: 'm2', 
      maPhieu: 'XK-2026-001', 
      loai: 'xuat' as const, 
      trangThai: 'dang_van_chuyen' as const,
      dvVanChuyen: 'Shopee Xpress (SPX)',
      maVanDon: 'SPXVN03928191',
      doiTac: 'Hệ thống CellphoneS', 
      kho: 'Kho Tổng Hà Nội',
      tenHang: 'iPhone 15 Pro Max, Chuột Logitech MX Master 3S', 
      soLuong: 10, 
      tongTien: 171350000, 
      thoiGian: '10:15 03/09/2026', 
      nguoiLap: 'Trần Thị Mai',
      ghiChu: 'Xuất hàng chuỗi bán lẻ theo đơn ĐH-302',
      danhSachHang: [
        { spId: 'p1', sku: 'SKU-IP15P-256', ten: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên', donVi: 'Chiếc', soLuong: 5, donGia: 31990000, thanhTien: 159950000 },
        { spId: 'p6', sku: 'SKU-LOG-MX3S', ten: 'Chuột không dây Logitech MX Master 3S Graphite', donVi: 'Cái', soLuong: 5, donGia: 2280000, thanhTien: 11400000 }
      ]
    },
    { 
      id: 'm3', 
      maPhieu: 'NK-2026-002', 
      loai: 'nhap' as const, 
      trangThai: 'cho_duyet' as const,
      dvVanChuyen: 'Viettel Post',
      maVanDon: 'VTP5519283VN',
      doiTac: 'FPT Synnex', 
      kho: 'Kho Chi nhánh Bình Dương',
      tenHang: 'Tai nghe AirPods Pro Gen 2', 
      soLuong: 30, 
      tongTien: 138000000, 
      thoiGian: '14:00 03/09/2026', 
      nguoiLap: 'Lê Hoàng Nam',
      ghiChu: 'Nhập đơn lẻ 1 mặt hàng - chờ kiểm đếm xác nhận',
      danhSachHang: [
        { spId: 'p3', sku: 'SKU-APM2-USB', ten: 'Tai nghe AirPods Pro Gen 2 Type-C', donVi: 'Hộp', soLuong: 30, donGia: 4600000, thanhTien: 138000000 }
      ]
    },
    { 
      id: 'm4', 
      maPhieu: 'XK-2026-002', 
      loai: 'xuat' as const, 
      trangThai: 'thanh_cong' as const,
      dvVanChuyen: 'J&T Express',
      maVanDon: 'JT7729103VN',
      doiTac: 'Đại lý Hoàng Hà Mobile', 
      kho: 'Kho Chi nhánh Bình Dương',
      tenHang: 'Tai nghe AirPods Pro Gen 2', 
      soLuong: 22, 
      tongTien: 120780000, 
      thoiGian: '09:45 04/09/2026', 
      nguoiLap: 'Lê Hoàng Nam',
      ghiChu: 'Xuất giao đại lý Hoàng Hà',
      danhSachHang: [
        { spId: 'p3', sku: 'SKU-APM2-USB', ten: 'Tai nghe AirPods Pro Gen 2 Type-C', donVi: 'Hộp', soLuong: 22, donGia: 5490000, thanhTien: 120780000 }
      ]
    },
    { 
      id: 'm5', 
      maPhieu: 'NK-2026-003', 
      loai: 'nhap' as const, 
      trangThai: 'tra_hang' as const,
      dvVanChuyen: 'Shopee Xpress (SPX)',
      maVanDon: 'SPXTH991823',
      doiTac: 'Digiworld Corporation (DGW)', 
      kho: 'Kho Tổng Hà Nội',
      tenHang: 'Màn hình Dell UltraSharp U2724D', 
      soLuong: 2, 
      tongTien: 17780000, 
      thoiGian: '16:20 04/09/2026', 
      nguoiLap: 'Ngô Thị Hương',
      ghiChu: 'Trả hàng về nơi nhập cho NCC Digiworld',
      lyDoTraHang: 'Hàng lỗi panel hở sáng mép dưới khi kiểm tra QA, gửi trả về nơi nhập (NCC Digiworld) để đổi lô mới.',
      danhSachHang: [
        { spId: 'p7', sku: 'SKU-DELL-U2724D', ten: 'Màn hình Dell UltraSharp U2724D 2K 120Hz IPS', donVi: 'Thùng', soLuong: 2, donGia: 8890000, thanhTien: 17780000 }
      ]
    },
    { 
      id: 'm6', 
      maPhieu: 'XK-2026-003', 
      loai: 'xuat' as const, 
      trangThai: 'tra_hang' as const,
      dvVanChuyen: 'Giao Hàng Tiết Kiệm (GHTK)',
      maVanDon: 'GHTK11209382',
      doiTac: 'Cửa hàng DigiCity', 
      kho: 'Kho Tổng Hà Nội',
      tenHang: 'MacBook Pro 14 M3 Pro', 
      soLuong: 1, 
      tongTien: 48990000, 
      thoiGian: '11:00 05/09/2026', 
      nguoiLap: 'Trần Thị Mai',
      ghiChu: 'Khách hàng trả hàng về nơi xuất (Kho Tổng)',
      lyDoTraHang: 'Khách nhận nhầm cấu hình phiên bản màu sắc, hàng nguyên seal gửi trả về nơi xuất (Kho Tổng) nhập hoàn.',
      danhSachHang: [
        { spId: 'p2', sku: 'SKU-MBPM3-14', ten: 'MacBook Pro 14 M3 Pro 18GB 512GB Space Black', donVi: 'Máy', soLuong: 1, donGia: 48990000, thanhTien: 48990000 }
      ]
    }
  ],
  danhSachNhaCungCap: [
    { id: 's1', ma: 'NCC-APL-01', ten: 'Apple Distribution Vietnam LLC', nguoiLienHe: 'Mr. David Chen', dienThoai: '028 3822 9999', email: 'supply@apple.com.vn', diaChi: 'Tầng 25, Bitexco, Q.1, TP.HCM', congNo: 450000000, trangThai: 'active' as const },
    { id: 's2', ma: 'NCC-FPT-02', ten: 'Công ty Cổ phần Synnex FPT', nguoiLienHe: 'Bà Nguyễn Thu Hằng', dienThoai: '024 7300 6666', email: 'contact@synnexfpt.com', diaChi: 'Tòa nhà FPT, Cầu Giấy, Hà Nội', congNo: 120000000, trangThai: 'active' as const },
    { id: 's3', ma: 'NCC-DGW-03', ten: 'Digiworld Corporation (DGW)', nguoiLienHe: 'Ông Trần Minh Quân', dienThoai: '028 3929 1888', email: 'order@digiworld.com.vn', diaChi: '195 Cô Bắc, P. Cô Giang, Q.1, TP.HCM', congNo: 85000000, trangThai: 'active' as const },
    { id: 's4', ma: 'NCC-SMC-04', ten: 'Samsung Electronics Vietnam', nguoiLienHe: 'Kim Sang Woo', dienThoai: '024 3555 8888', email: 'b2b.vn@samsung.com', diaChi: 'Khu CN Yên Phong, Bắc Ninh', congNo: 0, trangThai: 'active' as const }
  ],
  nhatKyKiemToan: [
    { id: 'k1', thoiGian: '10:30:00 05/09/2026', nguoiThaoTac: 'Ngô Thị Hương', vaiTro: 'Quản trị viên', hanhDong: 'ĐĂNG NHẬP HỆ THỐNG', doiTuong: 'Hệ thống kho', chiTiet: 'Đăng nhập phiên làm việc ban sáng' },
    { id: 'k2', thoiGian: '09:45:12 04/09/2026', nguoiThaoTac: 'Lê Hoàng Nam', vaiTro: 'Thủ kho', hanhDong: 'XUẤT KHO', doiTuong: 'XK-2026-002', chiTiet: 'Xuất 22 hộp Tai nghe AirPods Pro Gen 2 cho Hoàng Hà Mobile' },
    { id: 'k3', thoiGian: '14:00:20 03/09/2026', nguoiThaoTac: 'Lê Hoàng Nam', vaiTro: 'Thủ kho', hanhDong: 'NHẬP KHO', doiTuong: 'NK-2026-002', chiTiet: 'Nhập 30 hộp Tai nghe AirPods Pro Gen 2 từ FPT Synnex' }
  ]
};

function docKho<T>(key: string, giaTriMacDinh: T): T {
  try {
    const raw = localStorage.getItem('stockflow_' + key);
    if (!raw) {
      localStorage.setItem('stockflow_' + key, JSON.stringify(giaTriMacDinh));
      return giaTriMacDinh;
    }
    const parsed = JSON.parse(raw);
    // Sanitize any legacy data
    if (key === 'currentUser' && parsed) {
      if (parsed.ten === 'Nguyễn Văn An' || parsed.id === 'AD001' || (parsed.email && parsed.email.includes('@kho.vn'))) {
        localStorage.setItem('stockflow_' + key, JSON.stringify(giaTriMacDinh));
        return giaTriMacDinh;
      }
    }
    if (key === 'nhanSu' && Array.isArray(parsed)) {
      const cleaned = parsed
        .filter((u: any) => u.ten !== 'Nguyễn Văn An' && u.id !== 'AD001')
        .map((u: any) => ({
          ...u,
          email: u.email ? u.email.replace('@kho.vn', '@stockflow.vn') : u.email
        }));
      if (cleaned.length !== parsed.length || parsed.some((u: any) => u.email && u.email.includes('@kho.vn'))) {
        localStorage.setItem('stockflow_' + key, JSON.stringify(cleaned));
        return cleaned as unknown as T;
      }
    }
    return parsed;
  } catch (e) {
    console.error('Lỗi đọc kho:', e);
    return giaTriMacDinh;
  }
}

function ghiKho<T>(key: string, data: T): void {
  try {
    localStorage.setItem('stockflow_' + key, JSON.stringify(data));
  } catch (e) {
    console.error('Lỗi ghi kho:', e);
  }
}

export const StockStore = {
  getSanPham(): SanPham[] {
    return docKho('sanPham', DULIEU_MAC_DINH.danhSachSanPham);
  },
  setSanPham(list: SanPham[]) {
    ghiKho('sanPham', list);
  },
  capNhatSanPham(id: string, thongTinMoi: Partial<SanPham>): SanPham | null {
    const list = this.getSanPham();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...thongTinMoi };
      this.setSanPham(list);
      return list[idx];
    }
    return null;
  },
  themSanPham(spMoi: Omit<SanPham, 'id'>): SanPham {
    const list = this.getSanPham();
    const newSp: SanPham = {
      ...spMoi,
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
    };
    list.unshift(newSp);
    this.setSanPham(list);
    this.ghiNhatKy('THÊM SẢN PHẨM', newSp.sku, `Thêm sản phẩm "${newSp.ten}" vào ${newSp.kho}`);
    return newSp;
  },
  xoaSanPham(id: string): boolean {
    const list = this.getSanPham();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      const removed = list.splice(idx, 1)[0];
      this.setSanPham(list);
      this.ghiNhatKy('XÓA SẢN PHẨM', removed.sku, `Xóa sản phẩm "${removed.ten}" khỏi hệ thống`);
      return true;
    }
    return false;
  },

  getPhieu(): PhieuHang[] {
    const list = docKho('phieu', DULIEU_MAC_DINH.danhSachPhieu);
    return Array.isArray(list) ? list : [];
  },
  setPhieu(list: PhieuHang[]) {
    ghiKho('phieu', list);
  },
  themPhieu(phieuMoi: Omit<PhieuHang, 'id'>, capNhatTonKho = true): PhieuHang {
    const list = this.getPhieu();
    const p: PhieuHang = {
      ...phieuMoi,
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
    };

    if (capNhatTonKho && p.trangThai !== 'tra_hang') {
      const spList = this.getSanPham();
      p.danhSachHang.forEach(item => {
        const sp = spList.find(s => s.id === item.spId || s.sku === item.sku);
        if (sp) {
          if (p.loai === 'nhap') {
            sp.soLuong += item.soLuong;
          } else if (p.loai === 'xuat') {
            sp.soLuong = Math.max(0, sp.soLuong - item.soLuong);
          }
        }
      });
      this.setSanPham(spList);
    }

    list.unshift(p);
    this.setPhieu(list);
    this.ghiNhatKy(
      p.loai === 'nhap' ? 'LẬP PHIẾU NHẬP' : 'LẬP PHIẾU XUẤT',
      p.maPhieu,
      `Tạo phiếu ${p.loai === 'nhap' ? 'nhập' : 'xuất'} đối tác ${p.doiTac}, tổng ${p.soLuong} sản phẩm, trị giá ${dinhDangTien(p.tongTien)}`
    );
    return p;
  },
  xoaPhieu(id: string, hoanTacTon = true): { thanhCong: boolean; thongBao?: string; phieu?: PhieuHang } {
    const list = this.getPhieu();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return { thanhCong: false, thongBao: 'Không tìm thấy phiếu cần xóa' };

    const phieu = list[idx];
    if (hoanTacTon && phieu.trangThai !== 'tra_hang') {
      const sanPhamList = this.getSanPham();
      phieu.danhSachHang.forEach(item => {
        const sp = sanPhamList.find(s => s.id === item.spId || s.sku === item.sku);
        if (sp) {
          if (phieu.loai === 'nhap') {
            sp.soLuong = Math.max(0, sp.soLuong - item.soLuong);
          } else if (phieu.loai === 'xuat') {
            sp.soLuong += item.soLuong;
          }
        }
      });
      this.setSanPham(sanPhamList);
    }

    list.splice(idx, 1);
    this.setPhieu(list);
    this.ghiNhatKy('XÓA PHIẾU', phieu.maPhieu, `Xóa phiếu ${phieu.loai === 'nhap' ? 'Nhập' : 'Xuất'} ${phieu.maPhieu} (${hoanTacTon ? 'Đã hoàn tác tồn kho' : 'Không hoàn tác tồn'})`);
    return { thanhCong: true, phieu };
  },

  traHangPhieu(id: string, lyDo: string, nguoiThucHien: string): { thanhCong: boolean; thongBao?: string; phieu?: PhieuHang } {
    const list = this.getPhieu();
    const phieu = list.find(p => p.id === id);
    if (!phieu) return { thanhCong: false, thongBao: 'Không tìm thấy phiếu' };
    if (phieu.trangThai === 'tra_hang') return { thanhCong: false, thongBao: 'Phiếu này đã được ghi nhận trả hàng trước đó' };

    const sanPhamList = this.getSanPham();
    const items = phieu.danhSachHang || [];

    if (phieu.loai === 'nhap') {
      for (const item of items) {
        const sp = sanPhamList.find(s => s.id === item.spId || s.sku === item.sku);
        if (sp && sp.soLuong < item.soLuong) {
          return {
            thanhCong: false,
            thongBao: `Không thể trả hàng về NCC: Tồn kho hiện tại của "${sp.ten}" chỉ còn ${sp.soLuong}, không đủ để trả ${item.soLuong} sản phẩm!`
          };
        }
      }

      items.forEach(item => {
        const sp = sanPhamList.find(s => s.id === item.spId || s.sku === item.sku);
        if (sp) {
          sp.soLuong = Math.max(0, sp.soLuong - item.soLuong);
        }
      });
      this.setSanPham(sanPhamList);
    } else {
      items.forEach(item => {
        const sp = sanPhamList.find(s => s.id === item.spId || s.sku === item.sku);
        if (sp) {
          sp.soLuong += item.soLuong;
        }
      });
      this.setSanPham(sanPhamList);
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    phieu.trangThai = 'tra_hang';
    phieu.lyDoTraHang = lyDo || (phieu.loai === 'nhap' ? 'Trả hàng về nơi nhập (Nhà cung cấp)' : 'Khách trả hàng về nơi xuất (Kho hàng)');
    phieu.thoiGianTraHang = timeStr;
    phieu.nguoiTraHang = nguoiThucHien || 'Thủ kho';

    this.setPhieu(list);
    this.ghiNhatKy(
      'TRẢ HÀNG',
      phieu.maPhieu,
      `${phieu.loai === 'nhap' ? 'Trả hàng về nơi nhập (NCC ' + phieu.doiTac + ')' : 'Khách ' + phieu.doiTac + ' trả hàng về nơi xuất'}. Lý do: ${phieu.lyDoTraHang}`
    );

    return { thanhCong: true, phieu };
  },

  capNhatTrangThaiPhieu(id: string, trangThaiMoi: PhieuTrangThai): boolean {
    const list = this.getPhieu();
    const phieu = list.find(p => p.id === id);
    if (!phieu) return false;
    const cu = phieu.trangThai;
    phieu.trangThai = trangThaiMoi;
    this.setPhieu(list);
    this.ghiNhatKy('CẬP NHẬT TRẠNG THÁI', phieu.maPhieu, `Chuyển trạng thái phiếu từ ${cu} sang ${trangThaiMoi}`);
    return true;
  },

  getNhaCungCap(): NhaCungCap[] {
    return docKho('ncc', DULIEU_MAC_DINH.danhSachNhaCungCap);
  },
  setNhaCungCap(list: NhaCungCap[]) {
    ghiKho('ncc', list);
  },
  themNhaCungCap(nccMoi: Omit<NhaCungCap, 'id'>): NhaCungCap {
    const list = this.getNhaCungCap();
    const ncc: NhaCungCap = {
      ...nccMoi,
      id: 's_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
    };
    list.unshift(ncc);
    this.setNhaCungCap(list);
    this.ghiNhatKy('THÊM NCC', ncc.ma, `Thêm nhà cung cấp mới: ${ncc.ten}`);
    return ncc;
  },
  capNhatNhaCungCap(id: string, thongTinMoi: Partial<NhaCungCap>): NhaCungCap | null {
    const list = this.getNhaCungCap();
    const idx = list.findIndex(n => n.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...thongTinMoi };
      this.setNhaCungCap(list);
      this.ghiNhatKy('CẬP NHẬT NCC', list[idx].ma, `Cập nhật thông tin NCC ${list[idx].ten}`);
      return list[idx];
    }
    return null;
  },
  xoaNhaCungCap(id: string): boolean {
    const list = this.getNhaCungCap();
    const idx = list.findIndex(n => n.id === id);
    if (idx !== -1) {
      const removed = list.splice(idx, 1)[0];
      this.setNhaCungCap(list);
      this.ghiNhatKy('XÓA NCC', removed.ma, `Xóa nhà cung cấp ${removed.ten}`);
      return true;
    }
    return false;
  },

  getNhanSu(): User[] {
    return docKho('nhanSu', DULIEU_MAC_DINH.danhSachNguoiDung);
  },
  setNhanSu(list: User[]) {
    ghiKho('nhanSu', list);
  },
  themNhanSu(userMoi: Omit<User, 'id'>): User {
    const list = this.getNhanSu();
    const u: User = {
      ...userMoi,
      id: 'u_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
    };
    list.push(u);
    this.setNhanSu(list);
    this.ghiNhatKy('THÊM NHÂN SỰ', u.ten, `Thêm nhân viên ${u.ten} (${u.vaiTro})`);
    return u;
  },
  capNhatNhanSu(id: string, thongTinMoi: Partial<User>): User | null {
    const list = this.getNhanSu();
    const idx = list.findIndex(u => u.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...thongTinMoi };
      this.setNhanSu(list);
      return list[idx];
    }
    return null;
  },
  xoaNhanSu(id: string): boolean {
    const list = this.getNhanSu();
    const idx = list.findIndex(u => u.id === id);
    if (idx !== -1) {
      const removed = list.splice(idx, 1)[0];
      this.setNhanSu(list);
      this.ghiNhatKy('XÓA NHÂN SỰ', removed.ten, `Xóa tài khoản nhân viên ${removed.ten}`);
      return true;
    }
    return false;
  },

  getNhatKy(): NhatKy[] {
    return docKho('nhatKy', DULIEU_MAC_DINH.nhatKyKiemToan);
  },
  setNhatKy(list: NhatKy[]) {
    ghiKho('nhatKy', list);
  },
  ghiNhatKy(hanhDong: string, doiTuong: string, chiTiet: string) {
    const user = this.getCurrentUser();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const vaiTroMap: Record<UserRole, string> = {
      admin: 'Admin',
      manager: 'Quản lý',
      staff: 'Thủ kho',
      accountant: 'Kế toán kho',
      supervisor: 'Giám sát',
      employee: 'Nhân viên'
    };
    const logMoi: NhatKy = {
      id: 'k_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
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
  xoaTatCaNhatKy(): void {
    this.setNhatKy([]);
    this.ghiNhatKy('XÓA TOÀN BỘ NHẬT KÝ', 'Kiểm toán', 'Xóa toàn bộ lịch sử thao tác hệ thống');
  },

  getCurrentUser(): CurrentUser {
    return docKho('currentUser', DULIEU_MAC_DINH.nguoiDungHienTai);
  },
  setCurrentUser(user: CurrentUser) {
    ghiKho('currentUser', user);
  },

  datLaiMacDinh() {
    this.setSanPham(DULIEU_MAC_DINH.danhSachSanPham);
    this.setPhieu(DULIEU_MAC_DINH.danhSachPhieu);
    this.setNhaCungCap(DULIEU_MAC_DINH.danhSachNhaCungCap);
    this.setNhanSu(DULIEU_MAC_DINH.danhSachNguoiDung);
    this.setNhatKy(DULIEU_MAC_DINH.nhatKyKiemToan);
    this.setCurrentUser(DULIEU_MAC_DINH.nguoiDungHienTai);
  }
};

export function dinhDangTien(soTien: number | undefined): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien || 0);
}

export function dinhDangSo(n: number | undefined): string {
  return new Intl.NumberFormat('vi-VN').format(n || 0);
}
