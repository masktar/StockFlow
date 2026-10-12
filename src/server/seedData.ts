export interface DanhMucRecord {
  Ma_danh_muc: string;
  Ten_danh_muc: string;
}

export interface KhoRecord {
  Ma_kho: string;
  Ten_kho: string;
  Dia_chi: string;
  Tong_suc_chua: number;
  SDT: string;
}

export interface NhaCungCapRecord {
  Ma_ncc: string;
  Ten_ncc: string;
  Dia_chi: string;
  SDT: string;
  Email: string;
}

export interface NhanVienRecord {
  Ma_nhan_vien: string;
  Ten_nhan_vien: string;
  Vai_tro: string;
  Sdt: string;
  Email: string;
  Trang_thai: string;
  Ma_nv_quan_ly: string | null;
}

export interface DangNhapRecord {
  Email: string;
  Mat_khau: string;
}

export interface SanPhamRecord {
  Ma_san_pham: string;
  Ma_danh_muc: string;
  Ten_san_pham: string;
  Mo_ta: string;
  Nguong_ton_toi_thieu: number;
  Gia_ban: number;
  Gia_nhap: number;
  Ma_ncc: string;
}

export interface LuuTruRecord {
  Ma_kho: string;
  Ma_san_pham: string;
  Vi_tri: string;
  So_luong_ton: number;
}

export interface PhieuRecord {
  Ma_phieu: string;
  Ngay_nhap: string;
  Trang_thai: string;
  Ghi_chu: string;
  Ma_nhan_vien: string;
  loai: 'nhap' | 'xuat';
  Doi_tac?: string;
  Ma_ncc?: string;
  Nguoi_nhan?: string;
}

export interface CoTrongRecord {
  Ma_phieu: string;
  Ma_san_pham: string;
  So_luong: number;
}

// 1. DANH MỤC
export const SEED_DANH_MUC: DanhMucRecord[] = [
  { Ma_danh_muc: 'DM01', Ten_danh_muc: 'Điện thoại' },
  { Ma_danh_muc: 'DM02', Ten_danh_muc: 'Máy tính' },
  { Ma_danh_muc: 'DM03', Ten_danh_muc: 'Văn phòng phẩm' },
  { Ma_danh_muc: 'DM04', Ten_danh_muc: 'Nội thất' },
  { Ma_danh_muc: 'DM07', Ten_danh_muc: 'Hóa mỹ phẩm' },
  { Ma_danh_muc: 'DM10', Ten_danh_muc: 'Thời trang nam' },
  { Ma_danh_muc: 'DM12', Ten_danh_muc: 'Giày dép' },
  { Ma_danh_muc: 'DM13', Ten_danh_muc: 'Túi xách' },
  { Ma_danh_muc: 'DM14', Ten_danh_muc: 'Đồng hồ' },
  { Ma_danh_muc: 'DM15', Ten_danh_muc: 'Trang sức' },
  { Ma_danh_muc: 'DM19', Ten_danh_muc: 'Thể thao' },
  { Ma_danh_muc: 'DM20', Ten_danh_muc: 'Dụng cụ cắm trại' },
  { Ma_danh_muc: 'DM21', Ten_danh_muc: 'Xe đạp' },
  { Ma_danh_muc: 'DM23', Ten_danh_muc: 'Đồ điện gia dụng' },
  { Ma_danh_muc: 'DM24', Ten_danh_muc: 'Máy tính' },
  { Ma_danh_muc: 'DM25', Ten_danh_muc: 'Linh kiện máy tính' },
  { Ma_danh_muc: 'DM27', Ten_danh_muc: 'Phụ kiện điện thoại' },
  { Ma_danh_muc: 'DM28', Ten_danh_muc: 'Máy ảnh' },
  { Ma_danh_muc: 'DM29', Ten_danh_muc: 'Âm thanh' },
  { Ma_danh_muc: 'DM30', Ten_danh_muc: 'Đèn chiếu sáng' },
  { Ma_danh_muc: 'DM32', Ten_danh_muc: 'Đồ dùng nhà bếp' }
];

// 2. KHO MỚI
export const SEED_KHO: KhoRecord[] = [
  { Ma_kho: 'K01', Ten_kho: 'Kho Thanh Hóa 1', Dia_chi: 'Dĩ An, Đồng Nai', Tong_suc_chua: 6511, SDT: '0792651274' },
  { Ma_kho: 'K02', Ten_kho: 'Kho Khánh Hòa 2', Dia_chi: 'Biên Hòa, Bắc Ninh', Tong_suc_chua: 2138, SDT: '0887716833' },
  { Ma_kho: 'K03', Ten_kho: 'Kho Đồng Nai 3', Dia_chi: 'Đống Đa, Hải Phòng', Tong_suc_chua: 3840, SDT: '0348572421' },
  { Ma_kho: 'K04', Ten_kho: 'Kho Bắc Ninh 4', Dia_chi: 'Đống Đa, Nghệ An', Tong_suc_chua: 4088, SDT: '0819520085' },
  { Ma_kho: 'K05', Ten_kho: 'Kho Quảng Ninh 5', Dia_chi: 'Cầu Giấy, Đà Nẵng', Tong_suc_chua: 9682, SDT: '0534852602' },
  { Ma_kho: 'K06', Ten_kho: 'Kho Huế 6', Dia_chi: 'Ngô Quyền, Đà Nẵng', Tong_suc_chua: 4047, SDT: '0718728644' },
  { Ma_kho: 'K07', Ten_kho: 'Kho Cần Thơ 7', Dia_chi: 'Huế Center, Thanh Hóa', Tong_suc_chua: 7784, SDT: '0384459259' },
  { Ma_kho: 'K08', Ten_kho: 'Kho Đồng Nai 8', Dia_chi: 'Sầm Sơn, Đà Nẵng', Tong_suc_chua: 6637, SDT: '0487577279' },
  { Ma_kho: 'K09', Ten_kho: 'Kho Cần Thơ 9', Dia_chi: 'Đà Lạt, Nghệ An', Tong_suc_chua: 7811, SDT: '0608883592' },
  { Ma_kho: 'K10', Ten_kho: 'Kho Nghệ An 10', Dia_chi: 'Ninh Kiều, Bình Dương', Tong_suc_chua: 9508, SDT: '0817600233' },
  { Ma_kho: 'K11', Ten_kho: 'Kho Nghệ An 11', Dia_chi: 'Hải Châu, Thanh Hóa', Tong_suc_chua: 9596, SDT: '0594025590' },
  { Ma_kho: 'K12', Ten_kho: 'Kho Lâm Đồng 12', Dia_chi: 'Hải Châu, Lâm Đồng', Tong_suc_chua: 4511, SDT: '0548393869' },
  { Ma_kho: 'K13', Ten_kho: 'Kho Hà Nội 13', Dia_chi: 'Thủ Đức, Long An', Tong_suc_chua: 8440, SDT: '0993292768' },
  { Ma_kho: 'K14', Ten_kho: 'Kho Bình Dương 14', Dia_chi: 'Huế Center, Thanh Hóa', Tong_suc_chua: 3989, SDT: '0329189427' },
  { Ma_kho: 'K15', Ten_kho: 'Kho Bình Dương 15', Dia_chi: 'Ninh Kiều, Bình Dương', Tong_suc_chua: 9820, SDT: '0532510681' },
  { Ma_kho: 'K16', Ten_kho: 'Kho TP.HCM 16', Dia_chi: 'Vinh City, Thanh Hóa', Tong_suc_chua: 4513, SDT: '0911855694' },
  { Ma_kho: 'K17', Ten_kho: 'Kho Cần Thơ 17', Dia_chi: 'Vinh City, Bắc Ninh', Tong_suc_chua: 3172, SDT: '0408937268' },
  { Ma_kho: 'K18', Ten_kho: 'Kho Huế 18', Dia_chi: 'Vinh City, TP.HCM', Tong_suc_chua: 8144, SDT: '0483905224' },
  { Ma_kho: 'K19', Ten_kho: 'Kho TP.HCM 19', Dia_chi: 'Đống Đa, Huế', Tong_suc_chua: 6836, SDT: '0499173937' },
  { Ma_kho: 'K20', Ten_kho: 'Kho Bắc Ninh 20', Dia_chi: 'Hải Châu, Thanh Hóa', Tong_suc_chua: 6137, SDT: '0597196778' },
  { Ma_kho: 'K21', Ten_kho: 'Kho Khánh Hòa 21', Dia_chi: 'Thủ Đức, Cần Thơ', Tong_suc_chua: 6154, SDT: '0473292139' },
  { Ma_kho: 'K22', Ten_kho: 'Kho Cần Thơ 22', Dia_chi: 'Vinh City, TP.HCM', Tong_suc_chua: 1227, SDT: '0741997588' },
  { Ma_kho: 'K23', Ten_kho: 'Kho Lâm Đồng 23', Dia_chi: 'Vinh City, Đồng Nai', Tong_suc_chua: 1252, SDT: '0361537874' },
  { Ma_kho: 'K24', Ten_kho: 'Kho TP.HCM 24', Dia_chi: 'Biên Hòa, Hà Nội', Tong_suc_chua: 6077, SDT: '0432092060' },
  { Ma_kho: 'K25', Ten_kho: 'Kho TP.HCM 25', Dia_chi: 'Từ Sơn, Bình Dương', Tong_suc_chua: 8471, SDT: '0952035156' },
  { Ma_kho: 'K26', Ten_kho: 'Kho Bắc Ninh 26', Dia_chi: 'Đống Đa, Long An', Tong_suc_chua: 7622, SDT: '0639370843' },
  { Ma_kho: 'K27', Ten_kho: 'Kho Khánh Hòa 27', Dia_chi: 'Dĩ An, Khánh Hòa', Tong_suc_chua: 8580, SDT: '0757547120' },
  { Ma_kho: 'K28', Ten_kho: 'Kho Bắc Ninh 28', Dia_chi: 'Hải Châu, Bắc Ninh', Tong_suc_chua: 7130, SDT: '0838225743' },
  { Ma_kho: 'K29', Ten_kho: 'Kho Bắc Ninh 29', Dia_chi: 'Vinh City, Đồng Nai', Tong_suc_chua: 5782, SDT: '0682593446' },
  { Ma_kho: 'K30', Ten_kho: 'Kho Hà Nội 30', Dia_chi: 'Huế Center, Long An', Tong_suc_chua: 1387, SDT: '0602184162' },
  { Ma_kho: 'K31', Ten_kho: 'Kho Quảng Ninh 31', Dia_chi: 'Nha Trang, Cần Thơ', Tong_suc_chua: 3004, SDT: '0618839064' },
  { Ma_kho: 'K32', Ten_kho: 'Kho Huế 32', Dia_chi: 'Huế Center, Bình Dương', Tong_suc_chua: 1332, SDT: '0882136465' },
  { Ma_kho: 'K33', Ten_kho: 'Kho Bình Dương 33', Dia_chi: 'Dĩ An, Thanh Hóa', Tong_suc_chua: 1919, SDT: '0420900758' },
  { Ma_kho: 'K34', Ten_kho: 'Kho Đà Nẵng 34', Dia_chi: 'Hải Châu, TP.HCM', Tong_suc_chua: 1611, SDT: '0434949974' },
  { Ma_kho: 'K35', Ten_kho: 'Kho Thanh Hóa 35', Dia_chi: 'Từ Sơn, Khánh Hòa', Tong_suc_chua: 5951, SDT: '0330917511' },
  { Ma_kho: 'K36', Ten_kho: 'Kho Đồng Nai 36', Dia_chi: 'Ngô Quyền, Bình Dương', Tong_suc_chua: 7804, SDT: '0712430588' },
  { Ma_kho: 'K37', Ten_kho: 'Kho Đồng Nai 37', Dia_chi: 'Biên Hòa, Huế', Tong_suc_chua: 7897, SDT: '0535756434' },
  { Ma_kho: 'K38', Ten_kho: 'Kho Huế 38', Dia_chi: 'Ngô Quyền, Đà Nẵng', Tong_suc_chua: 9895, SDT: '0330512653' },
  { Ma_kho: 'K39', Ten_kho: 'Kho Bắc Ninh 39', Dia_chi: 'Hạ Long, Long An', Tong_suc_chua: 5177, SDT: '0458573823' },
  { Ma_kho: 'K40', Ten_kho: 'Kho Hải Phòng 40', Dia_chi: 'Cầu Giấy, Hà Nội', Tong_suc_chua: 5535, SDT: '0881055366' },
  { Ma_kho: 'K41', Ten_kho: 'Kho Nghệ An 41', Dia_chi: 'Huế Center, Cần Thơ', Tong_suc_chua: 6156, SDT: '0448882296' },
  { Ma_kho: 'K42', Ten_kho: 'Kho Bắc Ninh 42', Dia_chi: 'Thủ Đức, Lâm Đồng', Tong_suc_chua: 3937, SDT: '0893760025' },
  { Ma_kho: 'K43', Ten_kho: 'Kho Hà Nội 43', Dia_chi: 'Vinh City, Bình Dương', Tong_suc_chua: 9527, SDT: '0640910820' },
  { Ma_kho: 'K44', Ten_kho: 'Kho Hà Nội 44', Dia_chi: 'Cầu Giấy, Bắc Ninh', Tong_suc_chua: 4978, SDT: '0805243914' },
  { Ma_kho: 'K45', Ten_kho: 'Kho Hà Nội 45', Dia_chi: 'Biên Hòa, Bắc Ninh', Tong_suc_chua: 9333, SDT: '0461970548' },
  { Ma_kho: 'K46', Ten_kho: 'Kho Long An 46', Dia_chi: 'Hạ Long, Quảng Ninh', Tong_suc_chua: 6897, SDT: '0549658639' },
  { Ma_kho: 'K47', Ten_kho: 'Kho Thanh Hóa 47', Dia_chi: 'Vinh City, Bình Dương', Tong_suc_chua: 4292, SDT: '0702359538' },
  { Ma_kho: 'K48', Ten_kho: 'Kho Bình Dương 48', Dia_chi: 'Đà Lạt, Bắc Ninh', Tong_suc_chua: 8496, SDT: '0889264693' },
  { Ma_kho: 'K49', Ten_kho: 'Kho Huế 49', Dia_chi: 'Tân An, Long An', Tong_suc_chua: 6114, SDT: '0501758532' },
  { Ma_kho: 'K50', Ten_kho: 'Kho Đà Nẵng 50', Dia_chi: 'Huế Center, Đà Nẵng', Tong_suc_chua: 8943, SDT: '0305703511' }
];

// 3. NHÀ CUNG CẤP MỚI
export const SEED_NHA_CUNG_CAP: NhaCungCapRecord[] = [
  { Ma_ncc: 'NCC01', Ten_ncc: 'Công ty TNHH Minh Phát', Dia_chi: 'Nha Trang, Thanh Hóa', SDT: '0849565454', Email: 'minhphat1@supplier.vn' },
  { Ma_ncc: 'NCC02', Ten_ncc: 'Công ty TNHH Hoàng Long', Dia_chi: 'Biên Hòa, Long An', SDT: '0945351751', Email: 'hoanglong2@supplier.vn' },
  { Ma_ncc: 'NCC03', Ten_ncc: 'Tập đoàn An Khang', Dia_chi: 'Huế Center, Huế', SDT: '0914791075', Email: 'ankhang3@supplier.vn' },
  { Ma_ncc: 'NCC04', Ten_ncc: 'Tập đoàn Phú Quý', Dia_chi: 'Tân An, Huế', SDT: '0929771961', Email: 'phuquy4@supplier.vn' },
  { Ma_ncc: 'NCC05', Ten_ncc: 'Doanh nghiệp tư nhân Thịnh Vượng', Dia_chi: 'Biên Hòa, Hà Nội', SDT: '0959496827', Email: 'thinhvuong5@supplier.vn' },
  { Ma_ncc: 'NCC06', Ten_ncc: 'Công ty TNHH Đại Dương', Dia_chi: 'Hải Châu, Cần Thơ', SDT: '0405282126', Email: 'daiduong6@supplier.vn' },
  { Ma_ncc: 'NCC07', Ten_ncc: 'Doanh nghiệp tư nhân Hòa Bình', Dia_chi: 'Cầu Giấy, Lâm Đồng', SDT: '0826441373', Email: 'hoabinh7@supplier.vn' },
  { Ma_ncc: 'NCC08', Ten_ncc: 'Công ty TNHH MTV Nam Phong', Dia_chi: 'Dĩ An, Đồng Nai', SDT: '0570060143', Email: 'namphong8@supplier.vn' },
  { Ma_ncc: 'NCC09', Ten_ncc: 'Công ty TNHH MTV Việt Thành', Dia_chi: 'Từ Sơn, Huế', SDT: '0704096818', Email: 'vietthanh9@supplier.vn' },
  { Ma_ncc: 'NCC10', Ten_ncc: 'Tập đoàn Tân Tiến', Dia_chi: 'Thủ Đức, Quảng Ninh', SDT: '0665495893', Email: 'tantien10@supplier.vn' },
  { Ma_ncc: 'NCC11', Ten_ncc: 'Công ty TNHH Sao Mai', Dia_chi: 'Sầm Sơn, Cần Thơ', SDT: '0791180832', Email: 'saomai11@supplier.vn' },
  { Ma_ncc: 'NCC12', Ten_ncc: 'Công ty CP Hồng Hà', Dia_chi: 'Sầm Sơn, Hà Nội', SDT: '0696043876', Email: 'hongha12@supplier.vn' },
  { Ma_ncc: 'NCC13', Ten_ncc: 'Công ty TNHH MTV Bảo Long', Dia_chi: 'Đà Lạt, Đồng Nai', SDT: '0397371420', Email: 'baolong13@supplier.vn' },
  { Ma_ncc: 'NCC14', Ten_ncc: 'Doanh nghiệp tư nhân Kim Cương', Dia_chi: 'Tân An, Lâm Đồng', SDT: '0425035027', Email: 'kimcuong14@supplier.vn' },
  { Ma_ncc: 'NCC15', Ten_ncc: 'Doanh nghiệp tư nhân Phương Nam', Dia_chi: 'Tân An, Đồng Nai', SDT: '0863341564', Email: 'phuongnam15@supplier.vn' },
  { Ma_ncc: 'NCC16', Ten_ncc: 'Công ty TNHH MTV Đông Á', Dia_chi: 'Huế Center, Khánh Hòa', SDT: '0814526311', Email: 'donga16@supplier.vn' },
  { Ma_ncc: 'NCC17', Ten_ncc: 'Tập đoàn Thành Công', Dia_chi: 'Cầu Giấy, Khánh Hòa', SDT: '0541081736', Email: 'thanhcong17@supplier.vn' },
  { Ma_ncc: 'NCC18', Ten_ncc: 'Công ty CP Vạn Phát', Dia_chi: 'Đống Đa, Quảng Ninh', SDT: '0861799480', Email: 'vanphat18@supplier.vn' },
  { Ma_ncc: 'NCC19', Ten_ncc: 'Công ty TNHH Gia Hưng', Dia_chi: 'Huế Center, Nghệ An', SDT: '0452914319', Email: 'giahung19@supplier.vn' },
  { Ma_ncc: 'NCC20', Ten_ncc: 'Doanh nghiệp tư nhân Tân Á', Dia_chi: 'Biên Hòa, Lâm Đồng', SDT: '0431010732', Email: 'tana20@supplier.vn' },
  { Ma_ncc: 'NCC21', Ten_ncc: 'Doanh nghiệp tư nhân Hùng Vương', Dia_chi: 'Tân An, Quảng Ninh', SDT: '0885868185', Email: 'hungvuong21@supplier.vn' },
  { Ma_ncc: 'NCC22', Ten_ncc: 'Công ty TNHH MTV Thăng Long', Dia_chi: 'Hạ Long, Bắc Ninh', SDT: '0630312277', Email: 'thanglong22@supplier.vn' },
  { Ma_ncc: 'NCC23', Ten_ncc: 'Tập đoàn Bình Minh', Dia_chi: 'Tân An, Huế', SDT: '0731588425', Email: 'binhminh23@supplier.vn' },
  { Ma_ncc: 'NCC24', Ten_ncc: 'Doanh nghiệp tư nhân Toàn Cầu', Dia_chi: 'Dĩ An, Cần Thơ', SDT: '0588875140', Email: 'toancau24@supplier.vn' },
  { Ma_ncc: 'NCC25', Ten_ncc: 'Công ty TNHH Việt Phát', Dia_chi: 'Đống Đa, Đà Nẵng', SDT: '0941317229', Email: 'vietphat25@supplier.vn' },
  { Ma_ncc: 'NCC26', Ten_ncc: 'Doanh nghiệp tư nhân Đức Thịnh', Dia_chi: 'Tân An, Bình Dương', SDT: '0514573957', Email: 'ducthinh26@supplier.vn' },
  { Ma_ncc: 'NCC27', Ten_ncc: 'Công ty TNHH MTV Hải Âu', Dia_chi: 'Tân An, Nghệ An', SDT: '0848968520', Email: 'haiau27@supplier.vn' },
  { Ma_ncc: 'NCC28', Ten_ncc: 'Doanh nghiệp tư nhân Phúc Khang', Dia_chi: 'Huế Center, Thanh Hóa', SDT: '0336099144', Email: 'phuckhang28@supplier.vn' },
  { Ma_ncc: 'NCC29', Ten_ncc: 'Công ty TNHH MTV Đại Phát', Dia_chi: 'Nha Trang, Nghệ An', SDT: '0405628266', Email: 'daiphat29@supplier.vn' },
  { Ma_ncc: 'NCC30', Ten_ncc: 'Doanh nghiệp tư nhân An Bình', Dia_chi: 'Vinh City, Nghệ An', SDT: '0496547184', Email: 'anbinh30@supplier.vn' },
  { Ma_ncc: 'NCC31', Ten_ncc: 'Doanh nghiệp tư nhân Trường Thịnh', Dia_chi: 'Tân An, TP.HCM', SDT: '0996373372', Email: 'truongthinh31@supplier.vn' },
  { Ma_ncc: 'NCC32', Ten_ncc: 'Công ty TNHH MTV Nhật Minh', Dia_chi: 'Tân An, Bình Dương', SDT: '0403790621', Email: 'nhatminh32@supplier.vn' },
  { Ma_ncc: 'NCC33', Ten_ncc: 'Công ty CP Hoàng Gia', Dia_chi: 'Huế Center, Đà Nẵng', SDT: '0782534007', Email: 'hoanggia33@supplier.vn' },
  { Ma_ncc: 'NCC34', Ten_ncc: 'Công ty TNHH Á Châu', Dia_chi: 'Thủ Đức, Hà Nội', SDT: '0784504869', Email: 'achau34@supplier.vn' },
  { Ma_ncc: 'NCC35', Ten_ncc: 'Tập đoàn Việt Tín', Dia_chi: 'Thủ Đức, Khánh Hòa', SDT: '0513450963', Email: 'viettin35@supplier.vn' },
  { Ma_ncc: 'NCC36', Ten_ncc: 'Công ty CP Minh Long', Dia_chi: 'Hải Châu, Khánh Hòa', SDT: '0347952316', Email: 'minhlong36@supplier.vn' },
  { Ma_ncc: 'NCC37', Ten_ncc: 'Tập đoàn Thiên Phú', Dia_chi: 'Vinh City, Bắc Ninh', SDT: '0982264666', Email: 'thienphu37@supplier.vn' },
  { Ma_ncc: 'NCC38', Ten_ncc: 'Công ty TNHH MTV Sài Gòn Xanh', Dia_chi: 'Ngô Quyền, Hà Nội', SDT: '0636556570', Email: 'saigonxanh38@supplier.vn' },
  { Ma_ncc: 'NCC39', Ten_ncc: 'Tập đoàn Hồng Phúc', Dia_chi: 'Tân An, Quảng Ninh', SDT: '0444809748', Email: 'hongphuc39@supplier.vn' },
  { Ma_ncc: 'NCC40', Ten_ncc: 'Tập đoàn Cát Tường', Dia_chi: 'Biên Hòa, Nghệ An', SDT: '0931289885', Email: 'cattuong40@supplier.vn' },
  { Ma_ncc: 'NCC41', Ten_ncc: 'Công ty CP Phát Đạt', Dia_chi: 'Sầm Sơn, TP.HCM', SDT: '0748586715', Email: 'phatdat41@supplier.vn' },
  { Ma_ncc: 'NCC42', Ten_ncc: 'Công ty CP Kim Long', Dia_chi: 'Ngô Quyền, Huế', SDT: '0929244052', Email: 'kimlong42@supplier.vn' },
  { Ma_ncc: 'NCC43', Ten_ncc: 'Công ty TNHH MTV Quang Minh', Dia_chi: 'Huế Center, Đồng Nai', SDT: '0459489639', Email: 'quangminh43@supplier.vn' },
  { Ma_ncc: 'NCC44', Ten_ncc: 'Tập đoàn Bảo Tín', Dia_chi: 'Dĩ An, Đồng Nai', SDT: '0315173982', Email: 'baotin44@supplier.vn' },
  { Ma_ncc: 'NCC45', Ten_ncc: 'Công ty TNHH Tân Thịnh', Dia_chi: 'Hạ Long, Long An', SDT: '0378848440', Email: 'tanthinh45@supplier.vn' },
  { Ma_ncc: 'NCC46', Ten_ncc: 'Công ty TNHH Hòa Phát', Dia_chi: 'Từ Sơn, Bắc Ninh', SDT: '0679463372', Email: 'hoaphat46@supplier.vn' },
  { Ma_ncc: 'NCC47', Ten_ncc: 'Công ty TNHH Song Long', Dia_chi: 'Cầu Giấy, Thanh Hóa', SDT: '0811127328', Email: 'songlong47@supplier.vn' },
  { Ma_ncc: 'NCC48', Ten_ncc: 'Công ty TNHH MTV Đông Dương', Dia_chi: 'Sầm Sơn, Nghệ An', SDT: '0650085734', Email: 'dongduong48@supplier.vn' },
  { Ma_ncc: 'NCC49', Ten_ncc: 'Công ty TNHH Việt Á', Dia_chi: 'Tân An, Nghệ An', SDT: '0913770386', Email: 'vieta49@supplier.vn' },
  { Ma_ncc: 'NCC50', Ten_ncc: 'Tập đoàn Hưng Thịnh', Dia_chi: 'Ninh Kiều, Đà Nẵng', SDT: '0934862558', Email: 'hungthinh50@supplier.vn' }
];

// 4. NHÂN VIÊN MỚI
export const SEED_NHAN_VIEN: NhanVienRecord[] = [
  { Ma_nhan_vien: 'NV001', Ten_nhan_vien: 'Ngô Thị Hương', Vai_tro: 'Admin', Sdt: '0694644927', Email: 'ngothihuong1@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: null },
  { Ma_nhan_vien: 'NV002', Ten_nhan_vien: 'Đỗ Anh Khang', Vai_tro: 'Admin', Sdt: '0729417229', Email: 'doanhkhang2@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: null },
  { Ma_nhan_vien: 'NV003', Ten_nhan_vien: 'Phạm Văn Vinh', Vai_tro: 'Quản lý', Sdt: '0924642010', Email: 'phamvanvinh3@stockflow.vn', Trang_thai: 'Nghỉ việc', Ma_nv_quan_ly: 'NV002' },
  { Ma_nhan_vien: 'NV004', Ten_nhan_vien: 'Đặng Văn Phong', Vai_tro: 'Quản lý', Sdt: '0369314647', Email: 'dangvanphong4@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV002' },
  { Ma_nhan_vien: 'NV005', Ten_nhan_vien: 'Huỳnh Anh Dũng', Vai_tro: 'Quản lý', Sdt: '0818184808', Email: 'huynhanhdung5@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV002' },
  { Ma_nhan_vien: 'NV006', Ten_nhan_vien: 'Hồ Thành Vinh', Vai_tro: 'Quản lý', Sdt: '0825311624', Email: 'hothanhvinh6@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV002' },
  { Ma_nhan_vien: 'NV007', Ten_nhan_vien: 'Trần Quốc Giang', Vai_tro: 'Quản lý', Sdt: '0686632201', Email: 'tranquocgiang7@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV001' },
  { Ma_nhan_vien: 'NV008', Ten_nhan_vien: 'Đặng Bích Nhung', Vai_tro: 'Quản lý', Sdt: '0576477924', Email: 'dangbichnhung8@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV002' },
  { Ma_nhan_vien: 'NV009', Ten_nhan_vien: 'Hồ Quốc An', Vai_tro: 'Thủ kho', Sdt: '0977038636', Email: 'hoquocan9@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV007' },
  { Ma_nhan_vien: 'NV010', Ten_nhan_vien: 'Lý Diệu Nhung', Vai_tro: 'Thủ kho', Sdt: '0530686646', Email: 'lydieunhung10@stockflow.vn', Trang_thai: 'Nghỉ việc', Ma_nv_quan_ly: 'NV004' },
  { Ma_nhan_vien: 'NV011', Ten_nhan_vien: 'Huỳnh Thị Hương', Vai_tro: 'Thủ kho', Sdt: '0525131600', Email: 'huynhthihuong11@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV007' },
  { Ma_nhan_vien: 'NV012', Ten_nhan_vien: 'Hoàng Minh An', Vai_tro: 'Thủ kho', Sdt: '0435812833', Email: 'hoangminhan12@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV005' },
  { Ma_nhan_vien: 'NV013', Ten_nhan_vien: 'Nguyễn Hồng Dung', Vai_tro: 'Thủ kho', Sdt: '0824612608', Email: 'nguyenhongdung13@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV014', Ten_nhan_vien: 'Phan Anh Em', Vai_tro: 'Thủ kho', Sdt: '0649782776', Email: 'phananhem14@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV015', Ten_nhan_vien: 'Vũ Thu Giang', Vai_tro: 'Thủ kho', Sdt: '0720909020', Email: 'vuthugiang15@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV016', Ten_nhan_vien: 'Lý Ngọc Dung', Vai_tro: 'Thủ kho', Sdt: '0878847511', Email: 'lyngocdung16@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV007' },
  { Ma_nhan_vien: 'NV017', Ten_nhan_vien: 'Đặng Hữu Nam', Vai_tro: 'Thủ kho', Sdt: '0891963319', Email: 'danghuunam17@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV004' },
  { Ma_nhan_vien: 'NV018', Ten_nhan_vien: 'Lý Hữu Vinh', Vai_tro: 'Thủ kho', Sdt: '0454595263', Email: 'lyhuuvinh18@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV019', Ten_nhan_vien: 'Đỗ Thanh Nhung', Vai_tro: 'Thủ kho', Sdt: '0915192193', Email: 'dothanhnhung19@stockflow.vn', Trang_thai: 'Nghỉ việc', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV020', Ten_nhan_vien: 'Lê Xuân Long', Vai_tro: 'Thủ kho', Sdt: '0337069718', Email: 'lexuanlong20@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV005' },
  { Ma_nhan_vien: 'NV021', Ten_nhan_vien: 'Vũ Minh Minh', Vai_tro: 'Thủ kho', Sdt: '0492185102', Email: 'vuminhminh21@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV007' },
  { Ma_nhan_vien: 'NV022', Ten_nhan_vien: 'Bùi Thành Tuấn', Vai_tro: 'Thủ kho', Sdt: '0682950936', Email: 'buithanhtuan22@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV004' },
  { Ma_nhan_vien: 'NV023', Ten_nhan_vien: 'Huỳnh Quốc Sơn', Vai_tro: 'Thủ kho', Sdt: '0500330228', Email: 'huynhquocson23@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV004' },
  { Ma_nhan_vien: 'NV024', Ten_nhan_vien: 'Đỗ Thành Quang', Vai_tro: 'Thủ kho', Sdt: '0465247214', Email: 'dothanhquang24@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV007' },
  { Ma_nhan_vien: 'NV025', Ten_nhan_vien: 'Hồ Kim Hoa', Vai_tro: 'Thủ kho', Sdt: '0825856788', Email: 'hokimhoa25@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV003' },
  { Ma_nhan_vien: 'NV026', Ten_nhan_vien: 'Hoàng Công Khang', Vai_tro: 'Thủ kho', Sdt: '0622818521', Email: 'hoangcongkhang26@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV005' },
  { Ma_nhan_vien: 'NV027', Ten_nhan_vien: 'Phạm Thành Khang', Vai_tro: 'Thủ kho', Sdt: '0882768978', Email: 'phamthanhkhang27@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV028', Ten_nhan_vien: 'Dương Bích Hoa', Vai_tro: 'Thủ kho', Sdt: '0736793833', Email: 'duongbichhoa28@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV005' },
  { Ma_nhan_vien: 'NV029', Ten_nhan_vien: 'Võ Kim Ngọc', Vai_tro: 'Thủ kho', Sdt: '0456386076', Email: 'vokimngoc29@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV003' },
  { Ma_nhan_vien: 'NV030', Ten_nhan_vien: 'Phạm Bích Nga', Vai_tro: 'Thủ kho', Sdt: '0805557704', Email: 'phambichnga30@stockflow.vn', Trang_thai: 'Nghỉ việc', Ma_nv_quan_ly: 'NV003' },
  { Ma_nhan_vien: 'NV031', Ten_nhan_vien: 'Hồ Diệu Anh', Vai_tro: 'Thủ kho', Sdt: '0679058830', Email: 'hodieuanh31@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV032', Ten_nhan_vien: 'Bùi Diệu Ngọc', Vai_tro: 'Thủ kho', Sdt: '0576196143', Email: 'buidieungoc32@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV003' },
  { Ma_nhan_vien: 'NV033', Ten_nhan_vien: 'Lý Anh Việt', Vai_tro: 'Thủ kho', Sdt: '0475890092', Email: 'lyanhviet33@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV003' },
  { Ma_nhan_vien: 'NV034', Ten_nhan_vien: 'Đỗ Thành Bình', Vai_tro: 'Kế toán kho', Sdt: '0754021160', Email: 'dothanhbinh34@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV004' },
  { Ma_nhan_vien: 'NV035', Ten_nhan_vien: 'Huỳnh Thị Mai', Vai_tro: 'Kế toán kho', Sdt: '0483254552', Email: 'huynhthimai35@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV036', Ten_nhan_vien: 'Võ Thu Ngọc', Vai_tro: 'Kế toán kho', Sdt: '0831027380', Email: 'vothungoc36@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV004' },
  { Ma_nhan_vien: 'NV037', Ten_nhan_vien: 'Ngô Thanh Trinh', Vai_tro: 'Kế toán kho', Sdt: '0875377032', Email: 'ngothanhtrinh37@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV006' },
  { Ma_nhan_vien: 'NV038', Ten_nhan_vien: 'Trần Quốc Dũng', Vai_tro: 'Kế toán kho', Sdt: '0754383407', Email: 'tranquocdung38@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV005' },
  { Ma_nhan_vien: 'NV039', Ten_nhan_vien: 'Võ Hồng Anh', Vai_tro: 'Kế toán kho', Sdt: '0524606470', Email: 'vohonganh39@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV040', Ten_nhan_vien: 'Dương Bích Nhung', Vai_tro: 'Kế toán kho', Sdt: '0772958185', Email: 'duongbichnhung40@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV007' },
  { Ma_nhan_vien: 'NV041', Ten_nhan_vien: 'Phan Anh An', Vai_tro: 'Kế toán kho', Sdt: '0951341162', Email: 'phananhan41@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV004' },
  { Ma_nhan_vien: 'NV042', Ten_nhan_vien: 'Hoàng Hồng Linh', Vai_tro: 'Kế toán kho', Sdt: '0509859033', Email: 'hoanghonglinh42@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV003' },
  { Ma_nhan_vien: 'NV043', Ten_nhan_vien: 'Phan Thu Nga', Vai_tro: 'Kế toán kho', Sdt: '0680035249', Email: 'phanthunga43@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV007' },
  { Ma_nhan_vien: 'NV044', Ten_nhan_vien: 'Ngô Anh Vinh', Vai_tro: 'Kế toán kho', Sdt: '0469722624', Email: 'ngoanhvinh44@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV004' },
  { Ma_nhan_vien: 'NV045', Ten_nhan_vien: 'Nguyễn Đức Quang', Vai_tro: 'Kế toán kho', Sdt: '0988381610', Email: 'nguyenducquang45@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV006' },
  { Ma_nhan_vien: 'NV046', Ten_nhan_vien: 'Vũ Xuân Minh', Vai_tro: 'Kế toán kho', Sdt: '0332751084', Email: 'vuxuanminh46@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV004' },
  { Ma_nhan_vien: 'NV047', Ten_nhan_vien: 'Bùi Xuân Khang', Vai_tro: 'Kế toán kho', Sdt: '0995991668', Email: 'buixuankhang47@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV008' },
  { Ma_nhan_vien: 'NV048', Ten_nhan_vien: 'Bùi Đức Bình', Vai_tro: 'Kế toán kho', Sdt: '0588548201', Email: 'buiducbinh48@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV005' },
  { Ma_nhan_vien: 'NV049', Ten_nhan_vien: 'Hoàng Thị Trinh', Vai_tro: 'Kế toán kho', Sdt: '0727673333', Email: 'hoangthitrinh49@stockflow.vn', Trang_thai: 'Nghỉ việc', Ma_nv_quan_ly: 'NV007' },
  { Ma_nhan_vien: 'NV050', Ten_nhan_vien: 'Võ Thanh Lan', Vai_tro: 'Kế toán kho', Sdt: '0794140383', Email: 'vothanhlan50@stockflow.vn', Trang_thai: 'Đang làm', Ma_nv_quan_ly: 'NV005' }
];

export const SEED_DANG_NHAP: DangNhapRecord[] = SEED_NHAN_VIEN.map(nv => ({
  Email: nv.Email,
  Mat_khau: nv.Sdt
}));

// 5. SẢN PHẨM MỚI (50 sản phẩm công nghệ chuẩn 4 danh mục)
export const SEED_SAN_PHAM: SanPhamRecord[] = [
  { Ma_san_pham: 'SP001', Ma_danh_muc: 'DM01', Ten_san_pham: 'iPhone 15 Pro Max', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 20, Gia_ban: 10072674, Gia_nhap: 8520000, Ma_ncc: 'NCC10' },
  { Ma_san_pham: 'SP002', Ma_danh_muc: 'DM01', Ten_san_pham: 'iPhone 14', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 22, Gia_ban: 16272099, Gia_nhap: 11293000, Ma_ncc: 'NCC30' },
  { Ma_san_pham: 'SP003', Ma_danh_muc: 'DM01', Ten_san_pham: 'Samsung Galaxy S24 Ultra', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 17, Gia_ban: 32077511, Gia_nhap: 23940000, Ma_ncc: 'NCC04' },
  { Ma_san_pham: 'SP004', Ma_danh_muc: 'DM01', Ten_san_pham: 'Samsung Galaxy A55', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 27, Gia_ban: 34210198, Gia_nhap: 25955000, Ma_ncc: 'NCC49' },
  { Ma_san_pham: 'SP005', Ma_danh_muc: 'DM01', Ten_san_pham: 'Xiaomi 14', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 13, Gia_ban: 30923286, Gia_nhap: 26348000, Ma_ncc: 'NCC30' },
  { Ma_san_pham: 'SP006', Ma_danh_muc: 'DM01', Ten_san_pham: 'Xiaomi Redmi Note 13', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 16, Gia_ban: 30603122, Gia_nhap: 21894000, Ma_ncc: 'NCC34' },
  { Ma_san_pham: 'SP007', Ma_danh_muc: 'DM01', Ten_san_pham: 'Oppo Reno 11', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 21, Gia_ban: 10066617, Gia_nhap: 7221000, Ma_ncc: 'NCC19' },
  { Ma_san_pham: 'SP008', Ma_danh_muc: 'DM01', Ten_san_pham: 'Oppo A79', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 6, Gia_ban: 8810368, Gia_nhap: 6639000, Ma_ncc: 'NCC05' },
  { Ma_san_pham: 'SP009', Ma_danh_muc: 'DM01', Ten_san_pham: 'Vivo V29', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 21, Gia_ban: 24836074, Gia_nhap: 18825000, Ma_ncc: 'NCC25' },
  { Ma_san_pham: 'SP010', Ma_danh_muc: 'DM01', Ten_san_pham: 'Realme 12 Pro', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 30, Gia_ban: 34959935, Gia_nhap: 25150000, Ma_ncc: 'NCC30' },
  { Ma_san_pham: 'SP011', Ma_danh_muc: 'DM01', Ten_san_pham: 'Nokia G42', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 24, Gia_ban: 25828718, Gia_nhap: 19683000, Ma_ncc: 'NCC10' },
  { Ma_san_pham: 'SP012', Ma_danh_muc: 'DM01', Ten_san_pham: 'Google Pixel 8', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 15, Gia_ban: 9728148, Gia_nhap: 8401000, Ma_ncc: 'NCC26' },
  { Ma_san_pham: 'SP013', Ma_danh_muc: 'DM01', Ten_san_pham: 'Asus Zenfone 10', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 7, Gia_ban: 12462191, Gia_nhap: 9510000, Ma_ncc: 'NCC17' },
  { Ma_san_pham: 'SP014', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop Dell Inspiron 15', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 5, Gia_ban: 12409229, Gia_nhap: 9027000, Ma_ncc: 'NCC05' },
  { Ma_san_pham: 'SP015', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop Dell XPS 13', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 29, Gia_ban: 47592635, Gia_nhap: 40132000, Ma_ncc: 'NCC22' },
  { Ma_san_pham: 'SP016', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop HP Pavilion 14', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 27, Gia_ban: 19925925, Gia_nhap: 16042000, Ma_ncc: 'NCC31' },
  { Ma_san_pham: 'SP017', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop HP Envy x360', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 12, Gia_ban: 37019853, Gia_nhap: 27119000, Ma_ncc: 'NCC30' },
  { Ma_san_pham: 'SP018', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop Lenovo ThinkPad E14', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 27, Gia_ban: 27805633, Gia_nhap: 21894000, Ma_ncc: 'NCC33' },
  { Ma_san_pham: 'SP019', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop Lenovo IdeaPad Slim 5', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 15, Gia_ban: 38881788, Gia_nhap: 33450000, Ma_ncc: 'NCC16' },
  { Ma_san_pham: 'SP020', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop Asus Vivobook 15', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 24, Gia_ban: 23166703, Gia_nhap: 18077000, Ma_ncc: 'NCC50' },
  { Ma_san_pham: 'SP021', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop Asus ROG Strix', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 8, Gia_ban: 57610029, Gia_nhap: 44559000, Ma_ncc: 'NCC25' },
  { Ma_san_pham: 'SP022', Ma_danh_muc: 'DM02', Ten_san_pham: 'MacBook Air M2', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 20, Gia_ban: 47036962, Gia_nhap: 40728000, Ma_ncc: 'NCC14' },
  { Ma_san_pham: 'SP023', Ma_danh_muc: 'DM02', Ten_san_pham: 'MacBook Pro 14', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 17, Gia_ban: 10771927, Gia_nhap: 8230000, Ma_ncc: 'NCC09' },
  { Ma_san_pham: 'SP024', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop Acer Aspire 7', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 14, Gia_ban: 30692583, Gia_nhap: 21796000, Ma_ncc: 'NCC21' },
  { Ma_san_pham: 'SP025', Ma_danh_muc: 'DM02', Ten_san_pham: 'Laptop MSI Modern 14', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 13, Gia_ban: 48320506, Gia_nhap: 34292000, Ma_ncc: 'NCC38' },
  { Ma_san_pham: 'SP026', Ma_danh_muc: 'DM02', Ten_san_pham: 'PC mini Intel NUC', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 5, Gia_ban: 38807502, Gia_nhap: 29164000, Ma_ncc: 'NCC34' },
  { Ma_san_pham: 'SP027', Ma_danh_muc: 'DM03', Ten_san_pham: 'iPad Gen 10', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 10, Gia_ban: 9235729, Gia_nhap: 7003000, Ma_ncc: 'NCC14' },
  { Ma_san_pham: 'SP028', Ma_danh_muc: 'DM03', Ten_san_pham: 'iPad Air M1', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 23, Gia_ban: 7225709, Gia_nhap: 5489000, Ma_ncc: 'NCC30' },
  { Ma_san_pham: 'SP029', Ma_danh_muc: 'DM03', Ten_san_pham: 'iPad Pro 11 inch', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 17, Gia_ban: 9231667, Gia_nhap: 6639000, Ma_ncc: 'NCC27' },
  { Ma_san_pham: 'SP030', Ma_danh_muc: 'DM03', Ten_san_pham: 'Samsung Galaxy Tab S9', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 17, Gia_ban: 3901086, Gia_nhap: 3189000, Ma_ncc: 'NCC04' },
  { Ma_san_pham: 'SP031', Ma_danh_muc: 'DM03', Ten_san_pham: 'Samsung Galaxy Tab A9', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 13, Gia_ban: 11161414, Gia_nhap: 8537000, Ma_ncc: 'NCC24' },
  { Ma_san_pham: 'SP032', Ma_danh_muc: 'DM03', Ten_san_pham: 'Xiaomi Pad 6', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 7, Gia_ban: 13643687, Gia_nhap: 11367000, Ma_ncc: 'NCC03' },
  { Ma_san_pham: 'SP033', Ma_danh_muc: 'DM03', Ten_san_pham: 'Huawei MatePad 11', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 11, Gia_ban: 9640560, Gia_nhap: 6790000, Ma_ncc: 'NCC36' },
  { Ma_san_pham: 'SP034', Ma_danh_muc: 'DM03', Ten_san_pham: 'Lenovo Tab M10', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 26, Gia_ban: 5234158, Gia_nhap: 4165000, Ma_ncc: 'NCC45' },
  { Ma_san_pham: 'SP035', Ma_danh_muc: 'DM03', Ten_san_pham: 'Oppo Pad Air', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 19, Gia_ban: 26636914, Gia_nhap: 19891000, Ma_ncc: 'NCC03' },
  { Ma_san_pham: 'SP036', Ma_danh_muc: 'DM03', Ten_san_pham: 'Realme Pad 2', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 11, Gia_ban: 21857222, Gia_nhap: 18776000, Ma_ncc: 'NCC06' },
  { Ma_san_pham: 'SP037', Ma_danh_muc: 'DM03', Ten_san_pham: 'Microsoft Surface Go', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 10, Gia_ban: 6348809, Gia_nhap: 5146000, Ma_ncc: 'NCC01' },
  { Ma_san_pham: 'SP038', Ma_danh_muc: 'DM03', Ten_san_pham: 'Teclast Tablet P30', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 14, Gia_ban: 5718384, Gia_nhap: 4428000, Ma_ncc: 'NCC17' },
  { Ma_san_pham: 'SP039', Ma_danh_muc: 'DM04', Ten_san_pham: 'Đồng hồ thông minh Apple Watch', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 7, Gia_ban: 7922527, Gia_nhap: 5790000, Ma_ncc: 'NCC11' },
  { Ma_san_pham: 'SP040', Ma_danh_muc: 'DM04', Ten_san_pham: 'Đồng hồ thông minh Samsung Galaxy Watch', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 22, Gia_ban: 6860426, Gia_nhap: 5257000, Ma_ncc: 'NCC35' },
  { Ma_san_pham: 'SP041', Ma_danh_muc: 'DM04', Ten_san_pham: 'Tai nghe Sony WH-1000XM5', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 12, Gia_ban: 5733634, Gia_nhap: 4107000, Ma_ncc: 'NCC35' },
  { Ma_san_pham: 'SP042', Ma_danh_muc: 'DM04', Ten_san_pham: 'Tai nghe AirPods Pro', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 16, Gia_ban: 2517173, Gia_nhap: 1920000, Ma_ncc: 'NCC30' },
  { Ma_san_pham: 'SP043', Ma_danh_muc: 'DM04', Ten_san_pham: 'Loa Bluetooth JBL Flip 6', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 7, Gia_ban: 2358286, Gia_nhap: 2034000, Ma_ncc: 'NCC27' },
  { Ma_san_pham: 'SP044', Ma_danh_muc: 'DM04', Ten_san_pham: 'Loa Bluetooth Marshall Emberton', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 17, Gia_ban: 5416866, Gia_nhap: 4603000, Ma_ncc: 'NCC44' },
  { Ma_san_pham: 'SP045', Ma_danh_muc: 'DM04', Ten_san_pham: 'Sạc dự phòng Anker 20000mAh', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 24, Gia_ban: 1816625, Gia_nhap: 1512000, Ma_ncc: 'NCC11' },
  { Ma_san_pham: 'SP046', Ma_danh_muc: 'DM04', Ten_san_pham: 'Cáp sạc USB-C to Lightning', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 22, Gia_ban: 2190347, Gia_nhap: 1683000, Ma_ncc: 'NCC22' },
  { Ma_san_pham: 'SP047', Ma_danh_muc: 'DM04', Ten_san_pham: 'Ốp lưng điện thoại chống sốc', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 17, Gia_ban: 3372795, Gia_nhap: 2334000, Ma_ncc: 'NCC42' },
  { Ma_san_pham: 'SP048', Ma_danh_muc: 'DM04', Ten_san_pham: 'Chuột không dây Logitech', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 10, Gia_ban: 4574282, Gia_nhap: 3884000, Ma_ncc: 'NCC23' },
  { Ma_san_pham: 'SP049', Ma_danh_muc: 'DM04', Ten_san_pham: 'Bàn phím cơ AKKO', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 7, Gia_ban: 1613272, Gia_nhap: 1117000, Ma_ncc: 'NCC37' },
  { Ma_san_pham: 'SP050', Ma_danh_muc: 'DM04', Ten_san_pham: 'Balo laptop Targus', Mo_ta: 'Hàng chính hãng, bảo hành 12 tháng', Nguong_ton_toi_thieu: 21, Gia_ban: 2852326, Gia_nhap: 2042000, Ma_ncc: 'NCC31' }
];

// 6. LƯU TRỮ MỚI
export const SEED_LUU_TRU: LuuTruRecord[] = [
  { Ma_kho: 'K02', Ma_san_pham: 'SP022', Vi_tri: 'B8-19', So_luong_ton: 49 },
  { Ma_kho: 'K02', Ma_san_pham: 'SP029', Vi_tri: 'E5-05', So_luong_ton: 195 },
  { Ma_kho: 'K05', Ma_san_pham: 'SP029', Vi_tri: 'D1-15', So_luong_ton: 243 },
  { Ma_kho: 'K06', Ma_san_pham: 'SP007', Vi_tri: 'A4-13', So_luong_ton: 63 },
  { Ma_kho: 'K06', Ma_san_pham: 'SP048', Vi_tri: 'E1-09', So_luong_ton: 121 },
  { Ma_kho: 'K07', Ma_san_pham: 'SP015', Vi_tri: 'C8-03', So_luong_ton: 197 },
  { Ma_kho: 'K07', Ma_san_pham: 'SP045', Vi_tri: 'B6-03', So_luong_ton: 210 },
  { Ma_kho: 'K08', Ma_san_pham: 'SP009', Vi_tri: 'A7-03', So_luong_ton: 254 },
  { Ma_kho: 'K08', Ma_san_pham: 'SP025', Vi_tri: 'B5-20', So_luong_ton: 295 },
  { Ma_kho: 'K10', Ma_san_pham: 'SP029', Vi_tri: 'D2-18', So_luong_ton: 216 },
  { Ma_kho: 'K10', Ma_san_pham: 'SP039', Vi_tri: 'E5-09', So_luong_ton: 222 },
  { Ma_kho: 'K11', Ma_san_pham: 'SP007', Vi_tri: 'E9-01', So_luong_ton: 104 },
  { Ma_kho: 'K12', Ma_san_pham: 'SP033', Vi_tri: 'C1-20', So_luong_ton: 100 },
  { Ma_kho: 'K12', Ma_san_pham: 'SP034', Vi_tri: 'D5-02', So_luong_ton: 284 },
  { Ma_kho: 'K14', Ma_san_pham: 'SP012', Vi_tri: 'D7-16', So_luong_ton: 80 },
  { Ma_kho: 'K14', Ma_san_pham: 'SP040', Vi_tri: 'E5-18', So_luong_ton: 275 },
  { Ma_kho: 'K14', Ma_san_pham: 'SP045', Vi_tri: 'C7-08', So_luong_ton: 166 },
  { Ma_kho: 'K15', Ma_san_pham: 'SP025', Vi_tri: 'B6-18', So_luong_ton: 202 },
  { Ma_kho: 'K16', Ma_san_pham: 'SP021', Vi_tri: 'C1-04', So_luong_ton: 33 },
  { Ma_kho: 'K16', Ma_san_pham: 'SP028', Vi_tri: 'A6-06', So_luong_ton: 5 },
  { Ma_kho: 'K16', Ma_san_pham: 'SP043', Vi_tri: 'D3-20', So_luong_ton: 257 },
  { Ma_kho: 'K18', Ma_san_pham: 'SP029', Vi_tri: 'D5-09', So_luong_ton: 228 },
  { Ma_kho: 'K20', Ma_san_pham: 'SP011', Vi_tri: 'D3-15', So_luong_ton: 192 },
  { Ma_kho: 'K22', Ma_san_pham: 'SP036', Vi_tri: 'C7-08', So_luong_ton: 273 },
  { Ma_kho: 'K23', Ma_san_pham: 'SP048', Vi_tri: 'A1-14', So_luong_ton: 92 },
  { Ma_kho: 'K25', Ma_san_pham: 'SP045', Vi_tri: 'C6-15', So_luong_ton: 124 },
  { Ma_kho: 'K28', Ma_san_pham: 'SP033', Vi_tri: 'B6-01', So_luong_ton: 279 },
  { Ma_kho: 'K28', Ma_san_pham: 'SP041', Vi_tri: 'A5-18', So_luong_ton: 268 },
  { Ma_kho: 'K30', Ma_san_pham: 'SP039', Vi_tri: 'C9-04', So_luong_ton: 213 },
  { Ma_kho: 'K33', Ma_san_pham: 'SP019', Vi_tri: 'E9-12', So_luong_ton: 179 },
  { Ma_kho: 'K34', Ma_san_pham: 'SP020', Vi_tri: 'C5-04', So_luong_ton: 126 },
  { Ma_kho: 'K34', Ma_san_pham: 'SP028', Vi_tri: 'D6-08', So_luong_ton: 286 },
  { Ma_kho: 'K38', Ma_san_pham: 'SP025', Vi_tri: 'C1-04', So_luong_ton: 120 },
  { Ma_kho: 'K39', Ma_san_pham: 'SP012', Vi_tri: 'A2-12', So_luong_ton: 121 },
  { Ma_kho: 'K40', Ma_san_pham: 'SP017', Vi_tri: 'E8-10', So_luong_ton: 211 },
  { Ma_kho: 'K40', Ma_san_pham: 'SP034', Vi_tri: 'C3-14', So_luong_ton: 129 },
  { Ma_kho: 'K40', Ma_san_pham: 'SP038', Vi_tri: 'C4-20', So_luong_ton: 268 },
  { Ma_kho: 'K41', Ma_san_pham: 'SP006', Vi_tri: 'E5-11', So_luong_ton: 218 },
  { Ma_kho: 'K41', Ma_san_pham: 'SP027', Vi_tri: 'E6-17', So_luong_ton: 182 },
  { Ma_kho: 'K41', Ma_san_pham: 'SP032', Vi_tri: 'A5-02', So_luong_ton: 263 },
  { Ma_kho: 'K41', Ma_san_pham: 'SP041', Vi_tri: 'A8-19', So_luong_ton: 62 },
  { Ma_kho: 'K42', Ma_san_pham: 'SP007', Vi_tri: 'B9-16', So_luong_ton: 174 },
  { Ma_kho: 'K43', Ma_san_pham: 'SP031', Vi_tri: 'A2-05', So_luong_ton: 2 },
  { Ma_kho: 'K44', Ma_san_pham: 'SP037', Vi_tri: 'B5-18', So_luong_ton: 5 },
  { Ma_kho: 'K45', Ma_san_pham: 'SP010', Vi_tri: 'C3-16', So_luong_ton: 281 },
  { Ma_kho: 'K48', Ma_san_pham: 'SP017', Vi_tri: 'B8-06', So_luong_ton: 183 },
  { Ma_kho: 'K48', Ma_san_pham: 'SP040', Vi_tri: 'D8-10', So_luong_ton: 160 },
  { Ma_kho: 'K49', Ma_san_pham: 'SP009', Vi_tri: 'A1-15', So_luong_ton: 216 },
  { Ma_kho: 'K49', Ma_san_pham: 'SP022', Vi_tri: 'B8-14', So_luong_ton: 50 },
  { Ma_kho: 'K49', Ma_san_pham: 'SP025', Vi_tri: 'E4-01', So_luong_ton: 215 }
];

// 7. PHIẾU MỚI
export const SEED_PHIEU: PhieuRecord[] = [
  // Nhập
  { Ma_phieu: 'PN001', Ngay_nhap: '2026-01-01', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV039', loai: 'nhap', Doi_tac: 'Kho trung tâm', Ma_ncc: 'NCC23' },
  { Ma_phieu: 'PN002', Ngay_nhap: '2026-06-22', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV047', loai: 'nhap', Doi_tac: 'Kho trung tâm', Ma_ncc: 'NCC11' },
  { Ma_phieu: 'PN003', Ngay_nhap: '2026-03-04', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV026', loai: 'nhap', Doi_tac: 'Chi nhánh miền Nam', Ma_ncc: 'NCC13' },
  { Ma_phieu: 'PN004', Ngay_nhap: '2026-08-06', Trang_thai: 'Đã hủy', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV030', loai: 'nhap', Doi_tac: 'Bộ phận bán hàng', Ma_ncc: 'NCC17' },
  { Ma_phieu: 'PN005', Ngay_nhap: '2026-07-12', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV024', loai: 'nhap', Doi_tac: 'Đại lý cấp 1', Ma_ncc: 'NCC25' },
  { Ma_phieu: 'PN006', Ngay_nhap: '2026-08-09', Trang_thai: 'Chờ duyệt', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV038', loai: 'nhap', Doi_tac: 'Chi nhánh miền Bắc', Ma_ncc: 'NCC38' },
  { Ma_phieu: 'PN007', Ngay_nhap: '2026-06-16', Trang_thai: 'Đã hủy', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV025', loai: 'nhap', Doi_tac: 'Kho trung tâm', Ma_ncc: 'NCC24' },
  { Ma_phieu: 'PN008', Ngay_nhap: '2026-07-03', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV049', loai: 'nhap', Doi_tac: 'Kho trung tâm', Ma_ncc: 'NCC13' },
  { Ma_phieu: 'PN009', Ngay_nhap: '2026-07-02', Trang_thai: 'Chờ duyệt', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV048', loai: 'nhap', Doi_tac: 'Chi nhánh miền Bắc', Ma_ncc: 'NCC24' },
  { Ma_phieu: 'PN010', Ngay_nhap: '2026-06-29', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV031', loai: 'nhap', Doi_tac: 'Chi nhánh miền Nam', Ma_ncc: 'NCC05' },
  { Ma_phieu: 'PN011', Ngay_nhap: '2026-01-06', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV027', loai: 'nhap', Doi_tac: 'Chi nhánh miền Nam', Ma_ncc: 'NCC09' },
  { Ma_phieu: 'PN012', Ngay_nhap: '2026-08-27', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV039', loai: 'nhap', Doi_tac: 'Chi nhánh miền Nam', Ma_ncc: 'NCC19' },
  { Ma_phieu: 'PN013', Ngay_nhap: '2026-01-12', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV035', loai: 'nhap', Doi_tac: 'Chi nhánh miền Nam', Ma_ncc: 'NCC04' },
  { Ma_phieu: 'PN014', Ngay_nhap: '2026-01-28', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV050', loai: 'nhap', Doi_tac: 'Kho trung tâm', Ma_ncc: 'NCC23' },
  { Ma_phieu: 'PN015', Ngay_nhap: '2026-06-19', Trang_thai: 'Chờ duyệt', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV017', loai: 'nhap', Doi_tac: 'Đại lý cấp 1', Ma_ncc: 'NCC47' },
  { Ma_phieu: 'PN016', Ngay_nhap: '2026-07-16', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV046', loai: 'nhap', Doi_tac: 'Bộ phận bán hàng', Ma_ncc: 'NCC31' },
  { Ma_phieu: 'PN017', Ngay_nhap: '2026-05-12', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV014', loai: 'nhap', Doi_tac: 'Kho trung tâm', Ma_ncc: 'NCC20' },
  { Ma_phieu: 'PN018', Ngay_nhap: '2026-04-22', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV005', loai: 'nhap', Doi_tac: 'Chi nhánh miền Bắc', Ma_ncc: 'NCC18' },
  { Ma_phieu: 'PN019', Ngay_nhap: '2026-04-28', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV004', loai: 'nhap', Doi_tac: 'Bộ phận bán hàng', Ma_ncc: 'NCC26' },
  { Ma_phieu: 'PN020', Ngay_nhap: '2026-07-07', Trang_thai: 'Đã hủy', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV035', loai: 'nhap', Doi_tac: 'Đại lý cấp 1', Ma_ncc: 'NCC14' },
  { Ma_phieu: 'PN021', Ngay_nhap: '2026-08-22', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV044', loai: 'nhap', Doi_tac: 'Đại lý cấp 1', Ma_ncc: 'NCC08' },
  { Ma_phieu: 'PN022', Ngay_nhap: '2026-09-22', Trang_thai: 'Đã hủy', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV004', loai: 'nhap', Doi_tac: 'Chi nhánh miền Bắc', Ma_ncc: 'NCC44' },
  { Ma_phieu: 'PN023', Ngay_nhap: '2026-05-29', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV007', loai: 'nhap', Doi_tac: 'Chi nhánh miền Bắc', Ma_ncc: 'NCC05' },
  { Ma_phieu: 'PN024', Ngay_nhap: '2026-08-03', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV008', loai: 'nhap', Doi_tac: 'Đại lý cấp 1', Ma_ncc: 'NCC21' },
  { Ma_phieu: 'PN025', Ngay_nhap: '2026-02-04', Trang_thai: 'Hoàn thành', Ghi_chu: 'Nhập hàng định kỳ', Ma_nhan_vien: 'NV005', loai: 'nhap', Doi_tac: 'Kho trung tâm', Ma_ncc: 'NCC20' },

  // Xuất
  { Ma_phieu: 'PX001', Ngay_nhap: '2026-07-18', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV009', loai: 'xuat', Nguoi_nhan: 'Trần Ngọc Nga' },
  { Ma_phieu: 'PX002', Ngay_nhap: '2026-08-14', Trang_thai: 'Đã hủy', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV048', loai: 'xuat', Nguoi_nhan: 'Lê Kim Lan' },
  { Ma_phieu: 'PX003', Ngay_nhap: '2026-01-13', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV027', loai: 'xuat', Nguoi_nhan: 'Nguyễn Thị Ngọc' },
  { Ma_phieu: 'PX004', Ngay_nhap: '2026-07-09', Trang_thai: 'Đã hủy', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV044', loai: 'xuat', Nguoi_nhan: 'Bùi Hữu Khang' },
  { Ma_phieu: 'PX005', Ngay_nhap: '2026-08-14', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV004', loai: 'xuat', Nguoi_nhan: 'Ngô Thành Vinh' },
  { Ma_phieu: 'PX006', Ngay_nhap: '2026-08-01', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV010', loai: 'xuat', Nguoi_nhan: 'Vũ Thị Nhung' },
  { Ma_phieu: 'PX007', Ngay_nhap: '2026-05-17', Trang_thai: 'Đã hủy', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV011', loai: 'xuat', Nguoi_nhan: 'Lý Thanh Thảo' },
  { Ma_phieu: 'PX008', Ngay_nhap: '2026-07-23', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV005', loai: 'xuat', Nguoi_nhan: 'Bùi Thành Hải' },
  { Ma_phieu: 'PX009', Ngay_nhap: '2026-08-21', Trang_thai: 'Đã hủy', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV027', loai: 'xuat', Nguoi_nhan: 'Võ Hồng Phương' },
  { Ma_phieu: 'PX010', Ngay_nhap: '2026-09-02', Trang_thai: 'Chờ duyệt', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV041', loai: 'xuat', Nguoi_nhan: 'Lê Thị Thảo' },
  { Ma_phieu: 'PX011', Ngay_nhap: '2026-03-17', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV019', loai: 'xuat', Nguoi_nhan: 'Trần Văn Tuấn' },
  { Ma_phieu: 'PX012', Ngay_nhap: '2026-02-18', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV028', loai: 'xuat', Nguoi_nhan: 'Lý Công Dũng' },
  { Ma_phieu: 'PX013', Ngay_nhap: '2026-04-09', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV048', loai: 'xuat', Nguoi_nhan: 'Đỗ Ngọc Mai' },
  { Ma_phieu: 'PX014', Ngay_nhap: '2026-08-25', Trang_thai: 'Đã hủy', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV040', loai: 'xuat', Nguoi_nhan: 'Ngô Quốc Hải' },
  { Ma_phieu: 'PX015', Ngay_nhap: '2026-03-19', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV021', loai: 'xuat', Nguoi_nhan: 'Phan Xuân An' },
  { Ma_phieu: 'PX016', Ngay_nhap: '2026-03-23', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV002', loai: 'xuat', Nguoi_nhan: 'Lý Thành Giang' },
  { Ma_phieu: 'PX017', Ngay_nhap: '2026-02-22', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV030', loai: 'xuat', Nguoi_nhan: 'Hoàng Quốc Long' },
  { Ma_phieu: 'PX018', Ngay_nhap: '2026-07-17', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV024', loai: 'xuat', Nguoi_nhan: 'Ngô Đức Quang' },
  { Ma_phieu: 'PX019', Ngay_nhap: '2026-07-20', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV001', loai: 'xuat', Nguoi_nhan: 'Ngô Kim Dung' },
  { Ma_phieu: 'PX020', Ngay_nhap: '2026-07-07', Trang_thai: 'Đã hủy', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV043', loai: 'xuat', Nguoi_nhan: 'Đỗ Quốc Vinh' },
  { Ma_phieu: 'PX021', Ngay_nhap: '2026-02-17', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV036', loai: 'xuat', Nguoi_nhan: 'Lý Bích Ngọc' },
  { Ma_phieu: 'PX022', Ngay_nhap: '2026-04-23', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV022', loai: 'xuat', Nguoi_nhan: 'Vũ Hồng Yến' },
  { Ma_phieu: 'PX023', Ngay_nhap: '2026-05-12', Trang_thai: 'Hoàn thành', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV020', loai: 'xuat', Nguoi_nhan: 'Phan Đức Giang' },
  { Ma_phieu: 'PX024', Ngay_nhap: '2026-02-26', Trang_thai: 'Đã hủy', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV005', loai: 'xuat', Nguoi_nhan: 'Huỳnh Quốc Huy' },
  { Ma_phieu: 'PX025', Ngay_nhap: '2026-04-26', Trang_thai: 'Chờ duyệt', Ghi_chu: 'Xuất hàng theo yêu cầu', Ma_nhan_vien: 'NV036', loai: 'xuat', Nguoi_nhan: 'Ngô Thanh Trang' }
];

// 8. CHI TIẾT PHIẾU MỚI (có_trong)
export const SEED_CO_TRONG: CoTrongRecord[] = [
  { Ma_phieu: 'PN001', Ma_san_pham: 'SP005', So_luong: 8 },
  { Ma_phieu: 'PN001', Ma_san_pham: 'SP048', So_luong: 72 },
  { Ma_phieu: 'PN002', Ma_san_pham: 'SP016', So_luong: 66 },
  { Ma_phieu: 'PN002', Ma_san_pham: 'SP038', So_luong: 14 },
  { Ma_phieu: 'PN002', Ma_san_pham: 'SP046', So_luong: 6 },
  { Ma_phieu: 'PN003', Ma_san_pham: 'SP018', So_luong: 93 },
  { Ma_phieu: 'PN003', Ma_san_pham: 'SP020', So_luong: 68 },
  { Ma_phieu: 'PN006', Ma_san_pham: 'SP001', So_luong: 24 },
  { Ma_phieu: 'PN007', Ma_san_pham: 'SP020', So_luong: 52 },
  { Ma_phieu: 'PN008', Ma_san_pham: 'SP046', So_luong: 8 },
  { Ma_phieu: 'PN009', Ma_san_pham: 'SP002', So_luong: 3 },
  { Ma_phieu: 'PN010', Ma_san_pham: 'SP032', So_luong: 26 },
  { Ma_phieu: 'PN012', Ma_san_pham: 'SP026', So_luong: 12 },
  { Ma_phieu: 'PN013', Ma_san_pham: 'SP049', So_luong: 77 },
  { Ma_phieu: 'PN014', Ma_san_pham: 'SP001', So_luong: 1 },
  { Ma_phieu: 'PN015', Ma_san_pham: 'SP003', So_luong: 48 },
  { Ma_phieu: 'PN015', Ma_san_pham: 'SP017', So_luong: 79 },
  { Ma_phieu: 'PN016', Ma_san_pham: 'SP003', So_luong: 7 },
  { Ma_phieu: 'PN016', Ma_san_pham: 'SP023', So_luong: 11 },
  { Ma_phieu: 'PN018', Ma_san_pham: 'SP026', So_luong: 2 },
  { Ma_phieu: 'PN019', Ma_san_pham: 'SP045', So_luong: 12 },
  { Ma_phieu: 'PN020', Ma_san_pham: 'SP001', So_luong: 81 },
  { Ma_phieu: 'PN020', Ma_san_pham: 'SP011', So_luong: 50 },
  { Ma_phieu: 'PN021', Ma_san_pham: 'SP037', So_luong: 41 },
  { Ma_phieu: 'PN025', Ma_san_pham: 'SP034', So_luong: 66 },
  { Ma_phieu: 'PX002', Ma_san_pham: 'SP006', So_luong: 16 },
  { Ma_phieu: 'PX003', Ma_san_pham: 'SP048', So_luong: 41 },
  { Ma_phieu: 'PX004', Ma_san_pham: 'SP003', So_luong: 26 },
  { Ma_phieu: 'PX004', Ma_san_pham: 'SP006', So_luong: 56 },
  { Ma_phieu: 'PX004', Ma_san_pham: 'SP050', So_luong: 7 },
  { Ma_phieu: 'PX006', Ma_san_pham: 'SP018', So_luong: 59 },
  { Ma_phieu: 'PX007', Ma_san_pham: 'SP004', So_luong: 99 },
  { Ma_phieu: 'PX008', Ma_san_pham: 'SP031', So_luong: 58 },
  { Ma_phieu: 'PX009', Ma_san_pham: 'SP009', So_luong: 32 },
  { Ma_phieu: 'PX009', Ma_san_pham: 'SP049', So_luong: 92 },
  { Ma_phieu: 'PX011', Ma_san_pham: 'SP009', So_luong: 35 },
  { Ma_phieu: 'PX012', Ma_san_pham: 'SP018', So_luong: 100 },
  { Ma_phieu: 'PX015', Ma_san_pham: 'SP024', So_luong: 52 },
  { Ma_phieu: 'PX016', Ma_san_pham: 'SP003', So_luong: 36 },
  { Ma_phieu: 'PX016', Ma_san_pham: 'SP021', So_luong: 82 },
  { Ma_phieu: 'PX019', Ma_san_pham: 'SP018', So_luong: 2 },
  { Ma_phieu: 'PX019', Ma_san_pham: 'SP019', So_luong: 22 },
  { Ma_phieu: 'PX020', Ma_san_pham: 'SP005', So_luong: 98 },
  { Ma_phieu: 'PX020', Ma_san_pham: 'SP034', So_luong: 89 },
  { Ma_phieu: 'PX020', Ma_san_pham: 'SP044', So_luong: 36 },
  { Ma_phieu: 'PX021', Ma_san_pham: 'SP026', So_luong: 10 },
  { Ma_phieu: 'PX023', Ma_san_pham: 'SP005', So_luong: 99 },
  { Ma_phieu: 'PX024', Ma_san_pham: 'SP036', So_luong: 89 },
  { Ma_phieu: 'PX025', Ma_san_pham: 'SP007', So_luong: 54 },
  { Ma_phieu: 'PX025', Ma_san_pham: 'SP030', So_luong: 44 }
];
