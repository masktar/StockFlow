import { StockStore } from './store';
import { NhaCungCap, PhieuHang, SanPham } from '../types';

export const StockExcel = {
  xuatFileCSV(tenFile: string, duLieuRows: (string | number | undefined | null)[][]): void {
    let csvStr = '\uFEFF';
    duLieuRows.forEach(row => {
      const rowEscaped = row.map(cell => {
        if (cell === null || cell === undefined) return '""';
        const str = String(cell);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
      });
      csvStr += rowEscaped.join(',') + '\r\n';
    });

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', tenFile);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  docFileCSV(noiDungText: string): string[][] {
    if (noiDungText.charCodeAt(0) === 0xfeff) {
      noiDungText = noiDungText.slice(1);
    }

    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let i = 0; i < noiDungText.length; i++) {
      const char = noiDungText[i];
      const nextChar = noiDungText[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !insideQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
    }

    return rows;
  },

  taiFileMauHangHoa(): void {
    const rows = [
      [
        'Mã SKU (*)',
        'Tên sản phẩm (*)',
        'Danh mục',
        'Chi nhánh kho',
        'Số lượng tồn ban đầu',
        'Định mức an toàn',
        'Giá nhập vốn (VNĐ)',
        'Giá bán đề xuất (VNĐ)',
        'Đơn vị tính',
        'Vị trí kệ kho'
      ],
      [
        'SKU-IP16-128',
        'iPhone 16 128GB Black',
        'Điện thoại',
        'Kho Tổng Hà Nội',
        20,
        10,
        21000000,
        24990000,
        'Chiếc',
        'Kệ A1-05'
      ],
      [
        'SKU-SS-S24FE',
        'Samsung Galaxy S24 FE 8GB 256GB',
        'Điện thoại',
        'Kho Chi nhánh Bình Dương',
        15,
        5,
        14500000,
        16990000,
        'Chiếc',
        'Kệ A2-04'
      ]
    ];
    this.xuatFileCSV('Mau_Nhap_Hang_Hoa_StockFlow.csv', rows);
  },

  xuatBaoCaoHangHoa(kho = 'tat-ca'): void {
    let list = StockStore.getSanPham();
    if (kho !== 'tat-ca') {
      list = list.filter(p => p.kho === kho);
    }

    const rows: (string | number)[][] = [
      ['BÁO CÁO TỒN KHO & ĐỊNH MỨC AN TOÀN HÀNG HÓA - STOCKFLOW'],
      [`Thời gian xuất: ${new Date().toLocaleString('vi-VN')}`],
      [`Chi nhánh: ${kho === 'tat-ca' ? 'Toàn bộ các kho' : kho}`],
      []
    ];

    rows.push([
      'STT',
      'Mã SKU',
      'Tên sản phẩm',
      'Danh mục',
      'Kho hàng',
      'Tồn thực tế',
      'Định mức an toàn',
      'Tình trạng tồn',
      'Giá nhập vốn (VNĐ)',
      'Giá bán đề xuất (VNĐ)',
      'Tổng giá trị tồn kho (VNĐ)',
      'Đơn vị tính',
      'Vị trí kệ'
    ]);

    let tongSoLuong = 0;
    let tongGiaTri = 0;

    list.forEach((p, idx) => {
      const giaTri = p.soLuong * p.giaNhap;
      tongSoLuong += p.soLuong;
      tongGiaTri += giaTri;

      let tinhTrang = 'An toàn';
      if (p.soLuong === 0) tinhTrang = 'HẾT HÀNG (Cảnh báo đỏ)';
      else if (p.soLuong <= p.dinhMucToiThieu) tinhTrang = 'SẮP HẾT (Dưới định mức)';

      rows.push([
        idx + 1,
        p.sku,
        p.ten,
        p.danhMuc,
        p.kho,
        p.soLuong,
        p.dinhMucToiThieu,
        tinhTrang,
        p.giaNhap,
        p.giaXuat,
        giaTri,
        p.donVi,
        p.viTri
      ]);
    });

    rows.push([]);
    rows.push(['TỔNG CỘNG', '', '', '', '', tongSoLuong, '', '', '', '', tongGiaTri, '', '']);

    const ngay = new Date().toISOString().split('T')[0];
    this.xuatFileCSV(`Bao_Cao_Ton_Kho_StockFlow_${ngay}.csv`, rows);
  },

  xuatBaoCaoPhieu(loai: 'nhap' | 'xuat', kho = 'tat-ca'): void {
    let list = StockStore.getPhieu().filter(p => p.loai === loai);
    if (kho !== 'tat-ca') {
      list = list.filter(p => p.kho === kho);
    }

    const tenLoai = loai === 'nhap' ? 'NHẬP KHO' : 'XUẤT KHO';
    const rows: (string | number)[][] = [
      [`BÁO CÁO LỊCH SỬ CHỨNG TỪ ${tenLoai} - STOCKFLOW`],
      [`Thời gian xuất: ${new Date().toLocaleString('vi-VN')}`],
      [`Chi nhánh: ${kho === 'tat-ca' ? 'Toàn bộ kho' : kho}`],
      []
    ];

    rows.push([
      'STT',
      'Mã phiếu',
      'Thời gian',
      'Trạng thái',
      loai === 'nhap' ? 'Nhà cung cấp' : 'Khách hàng / Đại lý',
      'Kho thực hiện',
      'ĐV Vận chuyển',
      'Mã vận đơn',
      'Mặt hàng chi tiết',
      'Tổng SL',
      'Tổng thành tiền (VNĐ)',
      'Người lập phiếu',
      'Ghi chú',
      'Lý do trả hàng (nếu có)'
    ]);

    let tongTien = 0;
    let tongSl = 0;

    list.forEach((p, idx) => {
      tongTien += p.tongTien;
      tongSl += p.soLuong;

      const chiTietStr = (p.danhSachHang || [])
        .map(h => `${h.ten} (x${h.soLuong} ${h.donVi || ''})`)
        .join('; ');

      let trangThaiStr = 'Thành công';
      if (p.trangThai === 'dang_van_chuyen') trangThaiStr = 'Đang vận chuyển';
      else if (p.trangThai === 'cho_duyet') trangThaiStr = 'Chờ duyệt';
      else if (p.trangThai === 'tra_hang') trangThaiStr = 'Đã trả hàng / Hoàn kho';

      rows.push([
        idx + 1,
        p.maPhieu,
        p.thoiGian,
        trangThaiStr,
        p.doiTac,
        p.kho,
        p.dvVanChuyen || '',
        p.maVanDon || '',
        chiTietStr,
        p.soLuong,
        p.tongTien,
        p.nguoiLap,
        p.ghiChu,
        p.lyDoTraHang || ''
      ]);
    });

    rows.push([]);
    rows.push(['TỔNG CỘNG', '', '', '', '', '', '', '', '', tongSl, tongTien, '', '', '']);

    const ngay = new Date().toISOString().split('T')[0];
    this.xuatFileCSV(`Bao_Cao_Phieu_${tenLoai}_${ngay}.csv`, rows);
  },

  taiFileMauNCC(): void {
    const rows = [
      [
        'Mã NCC (*)',
        'Tên công ty / Đối tác (*)',
        'Người đại diện (*)',
        'Số điện thoại (*)',
        'Email',
        'Địa chỉ trụ sở',
        'Công nợ ban đầu (VNĐ)'
      ],
      [
        'NCC-ASUS-05',
        'ASUSTeK Computer Vietnam',
        'Ngô Minh Trí',
        '028 3811 2233',
        'support@asus.vn',
        'Tòa nhà Viettel, CMT8, Q.10, TP.HCM',
        50000000
      ],
      [
        'NCC-LG-06',
        'LG Electronics Việt Nam',
        'Trần Lan Anh',
        '024 3934 5588',
        'sales@lge.com.vn',
        'Khu CN Tràng Duệ, An Dương, Hải Phòng',
        0
      ]
    ];
    this.xuatFileCSV('Mau_Nhap_Nha_Cung_Cap_StockFlow.csv', rows);
  },

  xuatBaoCaoNCC(): void {
    const list = StockStore.getNhaCungCap();
    const rows: (string | number)[][] = [
      ['DANH BẠ NHÀ CUNG CẤP & TỔNG HỢP CÔNG NỢ ĐỐI TÁC - STOCKFLOW'],
      [`Thời gian xuất: ${new Date().toLocaleString('vi-VN')}`],
      []
    ];

    rows.push([
      'STT',
      'Mã NCC',
      'Tên công ty / Nhà phân phối',
      'Người đại diện',
      'Số điện thoại',
      'Email liên hệ',
      'Địa chỉ',
      'Công nợ phải trả (VNĐ)',
      'Trạng thái'
    ]);

    let tongCongNo = 0;
    list.forEach((n, idx) => {
      tongCongNo += n.congNo || 0;
      rows.push([
        idx + 1,
        n.ma,
        n.ten,
        n.nguoiLienHe,
        n.dienThoai,
        n.email,
        n.diaChi,
        n.congNo,
        n.trangThai === 'active' ? 'Đang hợp tác' : 'Tạm ngưng'
      ]);
    });

    rows.push([]);
    rows.push(['TỔNG CÔNG NỢ PHẢI TRẢ', '', '', '', '', '', '', tongCongNo, '']);

    const ngay = new Date().toISOString().split('T')[0];
    this.xuatFileCSV(`Bao_Cao_Cong_No_NCC_${ngay}.csv`, rows);
  },

  xuatBaoCaoNhatKy(): void {
    const list = StockStore.getNhatKy();
    const rows: (string | number)[][] = [
      ['NHẬT KÝ KIỂM TOÁN VÀ LỊCH SỬ THAO TÁC HỆ THỐNG - STOCKFLOW'],
      [`Thời gian xuất: ${new Date().toLocaleString('vi-VN')}`],
      []
    ];

    rows.push([
      'STT',
      'Thời gian',
      'Người thực hiện',
      'Vai trò',
      'Hành động',
      'Đối tượng tác động',
      'Chi tiết thao tác'
    ]);

    list.forEach((l, idx) => {
      rows.push([
        idx + 1,
        l.thoiGian,
        l.nguoiThaoTac,
        l.vaiTro,
        l.hanhDong,
        l.doiTuong,
        l.chiTiet
      ]);
    });

    const ngay = new Date().toISOString().split('T')[0];
    this.xuatFileCSV(`Nhat_Ky_Kiem_Toan_${ngay}.csv`, rows);
  }
};
