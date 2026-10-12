export type UserRole =
  | 'admin'
  | 'manager'
  | 'staff'
  | 'accountant'
  | 'supervisor'
  | 'employee';

export interface User {
  id: string;
  ten: string;
  email: string;
  dienThoai?: string;
  vaiTro: UserRole;
  phongBan?: string;
  trangThai?: 'active' | 'inactive';
}

export interface CurrentUser {
  id: string;
  ten: string;
  email: string;
  vaiTro: UserRole;
  chucDanh?: string;
}

export interface SanPham {
  id: string;
  sku: string;
  ten: string;
  danhMuc: string;
  kho: string;
  soLuong: number;
  dinhMucToiThieu: number;
  giaNhap: number;
  giaXuat: number;
  donVi: string;
  viTri: string;
}

export interface ChiTietPhieuHang {
  spId: string;
  sku: string;
  ten: string;
  donVi: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

export type PhieuLoai = 'nhap' | 'xuat';
export type PhieuTrangThai = 'thanh_cong' | 'dang_van_chuyen' | 'cho_duyet' | 'tra_hang';

export interface PhieuHang {
  id: string;
  maPhieu: string;
  loai: PhieuLoai;
  trangThai: PhieuTrangThai;
  dvVanChuyen: string;
  maVanDon: string;
  doiTac: string;
  kho: string;
  tenHang: string;
  soLuong: number;
  tongTien: number;
  thoiGian: string;
  nguoiLap: string;
  ghiChu: string;
  lyDoTraHang?: string;
  thoiGianTraHang?: string;
  nguoiTraHang?: string;
  danhSachHang: ChiTietPhieuHang[];
}

export interface NhaCungCap {
  id: string;
  ma: string;
  ten: string;
  nguoiLienHe: string;
  dienThoai: string;
  email: string;
  diaChi: string;
  congNo: number;
  trangThai: 'active' | 'inactive';
}

export interface NhatKy {
  id: string;
  thoiGian: string;
  nguoiThaoTac: string;
  vaiTro: string;
  hanhDong: string;
  doiTuong: string;
  chiTiet: string;
}

export type TabKey =
  | 'tong-quan'
  | 'hang-hoa'
  | 'nhap-kho'
  | 'xuat-kho'
  | 'nha-cung-cap'
  | 'nhan-su'
  | 'nhat-ky';

export interface RoleConfig {
  ten: string;
  badge: string;
  trangDuocPhep: TabKey[];
  moTa: string;
}
