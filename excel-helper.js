/**
 * STOCKFLOW EXCEL & CSV HELPER SERVICE
 * Xử lý nhập / xuất file Excel (CSV chuẩn UTF-8 BOM hiển thị tiếng Việt hoàn hảo trên Microsoft Excel)
 * Hỗ trợ tạo file mẫu, xem trước (Preview) dữ liệu trước khi lưu và xuất báo cáo tháng.
 */

const StockExcel = {
  // 1. Tải về file CSV kèm BOM UTF-8 (\uFEFF) để Excel trên Windows/Mac mở không bị lỗi font tiếng Việt
  xuatFileCSV(tenFile, duLieuRows) {
    let csvStr = "\uFEFF";
    duLieuRows.forEach(row => {
      const rowEscaped = row.map(cell => {
        if (cell === null || cell === undefined) return '""';
        const str = String(cell);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
      });
      csvStr += rowEscaped.join(",") + "\r\n";
    });

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", tenFile);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // 2. Parser CSV an toàn hỗ trợ dấu ngoặc kép, dấu phẩy bên trong văn bản và xuống dòng
  docFileCSV(noiDungText) {
    // Xóa BOM nếu có
    if (noiDungText.charCodeAt(0) === 0xFEFF) {
      noiDungText = noiDungText.slice(1);
    }

    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let i = 0; i < noiDungText.length; i++) {
      const char = noiDungText[i];
      const nextChar = noiDungText[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          // Escaped quote: ""
          currentCell += '"';
          i++; // Bỏ qua ký tự " tiếp theo
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !insideQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // Bỏ qua \n nếu là \r\n
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

  // ===========================================================================
  // MỤC 2: HÀNG HÓA & TỒN KHO (INVENTORY EXCEL)
  // ===========================================================================

  // Tải file mẫu nhập hàng hóa
  taiFileMauHangHoa() {
    const header = [
      "Mã SKU (*)",
      "Tên sản phẩm (*)",
      "Danh mục",
      "Chi nhánh kho",
      "Số lượng tồn ban đầu",
      "Định mức an toàn",
      "Giá nhập vốn (VNĐ)",
      "Giá bán đề xuất (VNĐ)",
      "Vị trí kệ",
      "Đơn vị tính"
    ];
    const mau1 = [
      "SKU-IPH16-256",
      "iPhone 16 Pro Max 256GB Titan Tự Nhiên",
      "Điện thoại",
      "Kho Tổng Hà Nội",
      "25",
      "10",
      "26500000",
      "29990000",
      "Kệ A1-01",
      "Chiếc"
    ];
    const mau2 = [
      "SKU-MACM3-16",
      "MacBook Pro 14 M3 Pro 18GB 512GB",
      "Laptop",
      "Kho Chi nhánh Bình Dương",
      "12",
      "5",
      "39000000",
      "44500000",
      "Kệ B2-04",
      "Máy"
    ];
    const mau3 = [
      "SKU-AIRPODS-4",
      "Tai nghe AirPods 4 Chống Ồn Chủ Động (ANC)",
      "Âm thanh",
      "Kho Đà Nẵng",
      "40",
      "15",
      "3200000",
      "4290000",
      "Kệ C1-02",
      "Bộ"
    ];

    this.xuatFileCSV("Mau_Nhap_Hang_Hoa_StockFlow.csv", [header, mau1, mau2, mau3]);
  },

  // Xuất báo cáo kiểm kê & tài sản tồn kho (theo tháng / kỳ)
  xuatBaoCaoHangHoa(boLocKho = 'tat-ca') {
    let list = StockStore.getSanPham();
    if (boLocKho !== 'tat-ca') {
      list = list.filter(sp => sp.kho === boLocKho);
    }

    const now = new Date();
    const thangHienTai = `Tháng ${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const ngayXuat = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const rows = [
      ["BÁO CÁO KIỂM KÊ TỒN KHO VÀ TÀI SẢN HÀNG HÓA"],
      [`Kỳ báo cáo: ${thangHienTai}`, `Thời điểm xuất: ${ngayXuat}`, `Kho áp dụng: ${boLocKho === 'tat-ca' ? 'Toàn bộ chi nhánh' : boLocKho}`],
      [],
      [
        "STT",
        "Mã SKU",
        "Tên sản phẩm",
        "Danh mục",
        "Kho lưu trữ",
        "Số lượng tồn",
        "Định mức tối thiểu",
        "Đơn vị",
        "Giá vốn (VNĐ)",
        "Giá bán (VNĐ)",
        "Tổng giá trị tồn (Giá vốn)",
        "Tổng giá trị niêm yết (Giá bán)",
        "Vị trí kệ",
        "Tình trạng kho"
      ]
    ];

    let tongSoLuong = 0;
    let tongGiaTriVon = 0;
    let tongGiaTriBan = 0;
    let soMatHangDuoiDinhMuc = 0;

    list.forEach((sp, idx) => {
      const triGiaVon = sp.soLuong * sp.giaNhap;
      const triGiaBan = sp.soLuong * sp.giaXuat;
      tongSoLuong += sp.soLuong;
      tongGiaTriVon += triGiaVon;
      tongGiaTriBan += triGiaBan;

      let tinhTrang = "Bình thường";
      if (sp.soLuong === 0) {
        tinhTrang = "HẾT HÀNG";
        soMatHangDuoiDinhMuc++;
      } else if (sp.soLuong <= sp.dinhMucToiThieu) {
        tinhTrang = "CẢNH BÁO THIẾU HÀNG";
        soMatHangDuoiDinhMuc++;
      }

      rows.push([
        idx + 1,
        sp.sku,
        sp.ten,
        sp.danhMuc,
        sp.kho,
        sp.soLuong,
        sp.dinhMucToiThieu,
        sp.donVi || 'Chiếc',
        sp.giaNhap,
        sp.giaXuat,
        triGiaVon,
        triGiaBan,
        sp.viTri || 'Chưa gán',
        tinhTrang
      ]);
    });

    // Dòng tổng kết
    rows.push([]);
    rows.push([
      "TỔNG CỘNG",
      `${list.length} mã SKU`,
      "",
      "",
      "",
      tongSoLuong,
      "",
      "",
      "",
      "",
      tongGiaTriVon,
      tongGiaTriBan,
      "",
      `Có ${soMatHangDuoiDinhMuc} mã dưới định mức`
    ]);

    const tenFile = `BaoCao_TonKho_${now.getFullYear()}_T${(now.getMonth() + 1).toString().padStart(2, '0')}_${Date.now()}.csv`;
    this.xuatFileCSV(tenFile, rows);
    StockStore.ghiNhatKy('XUẤT EXCEL', 'HÀNG HÓA', `Xuất báo cáo tồn kho tháng (${list.length} mã hàng, tổng giá trị vốn: ${dinhDangTien(tongGiaTriVon)})`);
  },

  // ===========================================================================
  // MỤC 3: PHIẾU NHẬP - XUẤT KHO (INBOUND / OUTBOUND MOVEMENTS)
  // ===========================================================================

  // Tải file mẫu nhập lô phiếu nhập / xuất
  taiFileMauNhapXuat() {
    const header = [
      "Loại giao dịch (* NHAP hoặc XUAT)",
      "Mã SKU mặt hàng (*)",
      "Số lượng (*)",
      "Đơn giá giao dịch (VNĐ)",
      "Đối tác / Khách hàng / Nhà xe (*)",
      "Kho thực hiện (*)",
      "Ghi chú giao dịch"
    ];
    const mau1 = [
      "NHAP",
      "SKU-IPH15-256",
      "20",
      "27000000",
      "Apple Authorized Reseller VN",
      "Kho Tổng Hà Nội",
      "Nhập bổ sung lô hàng đợt 1"
    ];
    const mau2 = [
      "XUAT",
      "SKU-DELL-XPS13",
      "3",
      "38500000",
      "Đại lý FPT Retail Chi nhánh 1",
      "Kho Tổng Hà Nội",
      "Xuất hàng bán sỉ theo đơn ĐH-882"
    ];
    this.xuatFileCSV("Mau_Phieu_Nhap_Xuat_Hang_Loat.csv", [header, mau1, mau2]);
  },

  // Xuất sổ chi tiết giao dịch Nhập - Xuất kho (báo cáo tháng)
  xuatBaoCaoNhapXuat(locLoai = 'tat-ca') {
    let phieuList = StockStore.getPhieu();
    if (locLoai === 'nhap') {
      phieuList = phieuList.filter(p => p.loai === 'nhap');
    } else if (locLoai === 'xuat') {
      phieuList = phieuList.filter(p => p.loai === 'xuat');
    }

    const now = new Date();
    const thangHienTai = `Tháng ${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const ngayXuat = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const rows = [
      ["SỔ CHI TIẾT GIAO DỊCH NHẬP - XUẤT KHO BÁO CÁO THÁNG"],
      [`Kỳ báo cáo: ${thangHienTai}`, `Thời điểm xuất: ${ngayXuat}`, `Phân loại: ${locLoai === 'tat-ca' ? 'Toàn bộ Nhập & Xuất' : (locLoai === 'nhap' ? 'Chỉ phiếu Nhập' : 'Chỉ phiếu Xuất')}`],
      [],
      [
        "STT",
        "Mã phiếu",
        "Loại phiếu",
        "Thời gian lập",
        "Mã SKU",
        "Tên sản phẩm",
        "Số lượng",
        "Đơn giá (VNĐ)",
        "Tổng giá trị (VNĐ)",
        "Đối tác / Khách hàng / Đại lý",
        "Kho thực hiện",
        "Người lập phiếu",
        "Ghi chú"
      ]
    ];

    let tongSLNhap = 0;
    let tongTienNhap = 0;
    let tongSLXuat = 0;
    let tongTienXuat = 0;

    phieuList.forEach((p, idx) => {
      const isNhap = p.loai === 'nhap';
      if (isNhap) {
        tongSLNhap += p.soLuong;
        tongTienNhap += p.tongTien;
      } else {
        tongSLXuat += p.soLuong;
        tongTienXuat += p.tongTien;
      }

      const donGia = p.donGia || (p.soLuong ? Math.round(p.tongTien / p.soLuong) : 0);
      rows.push([
        idx + 1,
        p.maPhieu || p.id,
        isNhap ? "NHẬP KHO (Inbound)" : "XUẤT KHO (Outbound)",
        p.thoiGian,
        p.sku || '',
        p.tenHang || p.tenSanPham || '',
        p.soLuong,
        donGia,
        p.tongTien,
        p.doiTac || 'Nội bộ',
        p.kho || 'Kho Tổng Hà Nội',
        p.nguoiLap,
        p.ghiChu || ''
      ]);
    });

    rows.push([]);
    rows.push([
      "TỔNG KẾT NHẬP KHO",
      "",
      "",
      "",
      "",
      "",
      tongSLNhap,
      "",
      tongTienNhap,
      `Tổng tiền nhập: ${dinhDangTien(tongTienNhap)}`,
      "",
      "",
      ""
    ]);
    rows.push([
      "TỔNG KẾT XUẤT KHO",
      "",
      "",
      "",
      "",
      "",
      tongSLXuat,
      "",
      tongTienXuat,
      `Tổng tiền xuất: ${dinhDangTien(tongTienXuat)}`,
      "",
      "",
      ""
    ]);

    const tenFile = `BaoCao_NhapXuat_${now.getFullYear()}_T${(now.getMonth() + 1).toString().padStart(2, '0')}_${Date.now()}.csv`;
    this.xuatFileCSV(tenFile, rows);
    StockStore.ghiNhatKy('XUẤT EXCEL', 'PHIẾU KHO', `Xuất báo cáo giao dịch tháng (${phieuList.length} phiếu, tổng nhập: ${dinhDangTien(tongTienNhap)}, tổng xuất: ${dinhDangTien(tongTienXuat)})`);
  },

  // ===========================================================================
  // MỤC 4: NHÀ CUNG CẤP & ĐỐI TÁC (SUPPLIERS)
  // ===========================================================================

  // Tải file mẫu danh bạ Nhà cung cấp
  taiFileMauNCC() {
    const header = [
      "Mã NCC (*)",
      "Tên công ty / Đối tác (*)",
      "Người đại diện / Liên hệ",
      "Số điện thoại",
      "Email",
      "Địa chỉ",
      "Công nợ hiện tại (VNĐ)"
    ];
    const mau1 = [
      "NCC-APPLE-VN",
      "Apple Authorized Reseller Vietnam",
      "Nguyễn Văn An",
      "028 3822 9999",
      "b2b@apple-vn.com",
      "Tầng 12, Vincom Đồng Khởi, Q.1, TP.HCM",
      "145000000"
    ];
    const mau2 = [
      "NCC-SAMSUNG-VINA",
      "Công ty TNHH Điện tử Samsung Vina",
      "Trần Thị Bích",
      "024 3974 8888",
      "contact@samsung-vina.com.vn",
      "Tòa nhà Landmark 72, Nam Từ Liêm, Hà Nội",
      "0"
    ];
    this.xuatFileCSV("Mau_Nha_Cung_Cap_StockFlow.csv", [header, mau1, mau2]);
  },

  // Xuất báo cáo danh bạ & công nợ Nhà cung cấp
  xuatBaoCaoNCC() {
    const list = StockStore.getNhaCungCap();
    const now = new Date();
    const thangHienTai = `Tháng ${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const ngayXuat = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const rows = [
      ["BÁO CÁO DANH BẠ ĐỐI TÁC VÀ TỔNG HỢP CÔNG NỢ NHÀ CUNG CẤP"],
      [`Kỳ báo cáo: ${thangHienTai}`, `Thời điểm xuất: ${ngayXuat}`],
      [],
      [
        "STT",
        "Mã NCC",
        "Tên công ty / Đối tác",
        "Người đại diện",
        "Số điện thoại",
        "Email",
        "Địa chỉ",
        "Công nợ hiện tại (VNĐ)",
        "Tình trạng nợ"
      ]
    ];

    let tongCongNo = 0;
    let soNccCoNo = 0;

    list.forEach((ncc, idx) => {
      const congNo = ncc.congNo || 0;
      tongCongNo += congNo;
      if (congNo > 0) soNccCoNo++;

      rows.push([
        idx + 1,
        ncc.id,
        ncc.ten,
        ncc.nguoiLienHe || '',
        ncc.sdt || '',
        ncc.email || '',
        ncc.diaChi || '',
        congNo,
        congNo > 0 ? "Đang có dư nợ phải trả" : "Đã thanh toán đủ (Hết nợ)"
      ]);
    });

    rows.push([]);
    rows.push([
      "TỔNG CỘNG CÔNG NỢ",
      `${list.length} nhà cung cấp`,
      "",
      "",
      "",
      "",
      "",
      tongCongNo,
      `Có ${soNccCoNo} NCC có dư nợ cần thanh toán`
    ]);

    const tenFile = `BaoCao_NhaCungCap_CongNo_${now.getFullYear()}_T${(now.getMonth() + 1).toString().padStart(2, '0')}_${Date.now()}.csv`;
    this.xuatFileCSV(tenFile, rows);
    StockStore.ghiNhatKy('XUẤT EXCEL', 'NHÀ CUNG CẤP', `Xuất báo cáo danh bạ & công nợ (${list.length} đối tác, tổng công nợ: ${dinhDangTien(tongCongNo)})`);
  }
};
