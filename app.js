/**
 * ====================================================================
 * STOCKFLOW - HỆ THỐNG QUẢN LÝ KHO VẬN (WMS)
 * PHIÊN BẢN JAVASCRIPT THUẦN (VANILLA JS + LOCALSTORAGE)
 * Dành cho sinh viên, đồ án môn học, dễ đọc, dễ giải thích với thầy cô
 * ====================================================================
 */

// 1. DỮ LIỆU KHỞI TẠO MẪU (NẾU CHƯA CÓ TRONG LOCALSTORAGE)
const DU_LIEU_MAU = {
  sanPham: [
    { id: 'SP-01', ma: 'LOGI-MXM3S', ten: 'Chuột Logitech MX Master 3S', nganhHang: 'Phụ kiện', kho: 'Kho Tổng Hà Nội', soLuong: 145, dinhMucToiThieu: 30, giaNhap: 1850000, giaBan: 2490000, viTri: 'Kệ A1-02' },
    { id: 'SP-02', ma: 'KEY-K2PRO', ten: 'Bàn phím cơ Keychron K2 Pro', nganhHang: 'Phụ kiện', kho: 'Kho Tổng Hà Nội', soLuong: 18, dinhMucToiThieu: 25, giaNhap: 1950000, giaBan: 2650000, viTri: 'Kệ A2-05' },
    { id: 'SP-03', ma: 'DELL-U2723QE', ten: 'Màn hình Dell UltraSharp 27 4K', nganhHang: 'Màn hình', kho: 'Kho Bình Dương', soLuong: 42, dinhMucToiThieu: 15, giaNhap: 11200000, giaBan: 13900000, viTri: 'Kệ B1-01' },
    { id: 'SP-04', ma: 'APPLE-MBA-M2', ten: 'MacBook Air M2 16GB/256GB', nganhHang: 'Laptop', kho: 'Kho Đà Nẵng', soLuong: 8, dinhMucToiThieu: 10, giaNhap: 23500000, giaBan: 27990000, viTri: 'Kệ C3-12' },
    { id: 'SP-05', ma: 'SONY-WH1000XM5', ten: 'Tai nghe chống ồn Sony WH-1000XM5', nganhHang: 'Âm thanh', kho: 'Kho Tổng Hà Nội', soLuong: 0, dinhMucToiThieu: 12, giaNhap: 6200000, giaBan: 7990000, viTri: 'Kệ A3-01' }
  ],
  phieuKho: [
    { id: 'PNK-001', ma: 'PNK-2026-001', loai: 'inbound', tenDoiTac: 'Công ty TNHH Synnex FPT', thoiGian: '08:30 04/09/2026', soLuong: 50, tongTien: 92500000, trangThai: 'completed', nguoiTao: 'Nguyễn Văn An' },
    { id: 'PXK-001', ma: 'PXK-2026-001', loai: 'outbound', tenDoiTac: 'Đại lý Bán Lẻ An Phát', thoiGian: '14:20 04/09/2026', soLuong: 15, tongTien: 37350000, trangThai: 'completed', nguoiTao: 'Trần Thị Mai' }
  ],
  nhanSu: [
    { id: 'NS-01', ten: 'Nguyễn Văn An', email: 'an.nguyen@stockflow.vn', sdt: '0912 345 678', boPhan: 'Ban Giám Đốc', vaiTro: 'admin', trangThai: 'active' },
    { id: 'NS-02', ten: 'Trần Thị Mai', email: 'mai.tran@stockflow.vn', sdt: '0988 765 432', boPhan: 'Kho Hà Nội', vaiTro: 'manager', trangThai: 'active' },
    { id: 'NS-03', ten: 'Lê Hoàng Long', email: 'long.le@stockflow.vn', sdt: '0903 112 233', boPhan: 'Kho Bình Dương', vaiTro: 'staff', trangThai: 'active' },
    { id: 'NS-04', ten: 'Phạm Thu Trang', email: 'trang.pham@stockflow.vn', sdt: '0934 556 778', boPhan: 'Kế Toán Tài Chính', vaiTro: 'accountant', trangThai: 'active' }
  ],
  nhatKy: [
    { id: 'NK-01', thoiGian: '08:30 04/09/2026', nguoiThucHien: 'Nguyễn Văn An', vaiTro: 'Quản trị viên', hanhDong: 'NHẬP KHO', doiTuong: 'PNK-2026-001', chiTiet: 'Nhập kho 50 Chuột Logitech MX Master 3S' },
    { id: 'NK-02', thoiGian: '14:20 04/09/2026', nguoiThucHien: 'Trần Thị Mai', vaiTro: 'Quản lý kho', hanhDong: 'XUẤT KHO', doiTuong: 'PXK-2026-001', chiTiet: 'Xuất kho 15 Chuột Logitech cho đại lý' }
  ]
};

// 2. KHỞI TẠO STATE TOÀN CỤC & ĐỌC TỪ LOCALSTORAGE
let danhSachSanPham = JSON.parse(localStorage.getItem('sf_sanPham')) || DU_LIEU_MAU.sanPham;
let danhSachPhieuKho = JSON.parse(localStorage.getItem('sf_phieuKho')) || DU_LIEU_MAU.phieuKho;
let danhSachNhanSu = JSON.parse(localStorage.getItem('sf_nhanSu')) || DU_LIEU_MAU.nhanSu;
let danhSachNhatKy = JSON.parse(localStorage.getItem('sf_nhatKy')) || DU_LIEU_MAU.nhatKy;

function luuVaoLocalStorage() {
  localStorage.setItem('sf_sanPham', JSON.stringify(danhSachSanPham));
  localStorage.setItem('sf_phieuKho', JSON.stringify(danhSachPhieuKho));
  localStorage.setItem('sf_nhanSu', JSON.stringify(danhSachNhanSu));
  localStorage.setItem('sf_nhatKy', JSON.stringify(danhSachNhatKy));
}
luuVaoLocalStorage();

function formatTien(soTien) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
}

// 3. GHI NHẬT KÝ KIỂM TOÁN (AUDIT LOG)
function ghiNhatKy(hanhDong, doiTuong, chiTiet) {
  const bayGio = new Date();
  const thoiGian = `${bayGio.getHours().toString().padStart(2, '0')}:${bayGio.getMinutes().toString().padStart(2, '0')} ${bayGio.getDate().toString().padStart(2, '0')}/${(bayGio.getMonth() + 1).toString().padStart(2, '0')}/${bayGio.getFullYear()}`;
  
  const logMoi = {
    id: 'NK-' + Date.now(),
    thoiGian,
    nguoiThucHien: 'Nguyễn Văn An',
    vaiTro: 'Quản trị viên',
    hanhDong,
    doiTuong,
    chiTiet
  };

  danhSachNhatKy.unshift(logMoi);
  luuVaoLocalStorage();
  hienThiNhatKy();
}

// 4. CHUYỂN TAB ĐIỀU HƯỚNG
function chuyenTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const tabEl = document.getElementById('tab-' + tabName);
  const btnEl = document.getElementById('btn-nav-' + tabName);
  if (tabEl) tabEl.classList.remove('hidden');
  if (btnEl) btnEl.classList.add('active');

  if (tabName === 'dashboard') hienThiDashboard();
  if (tabName === 'inventory') hienThiDanhSachSanPham();
  if (tabName === 'movements') hienThiDanhSachPhieuKho();
  if (tabName === 'users') hienThiNhanSu();
  if (tabName === 'audit') hienThiNhatKy();
}

// 5. HIỂN THỊ DASHBOARD (TỔNG QUAN KHO)
function hienThiDashboard() {
  const tongMatHang = danhSachSanPham.length;
  const tongSoLuongTon = danhSachSanPham.reduce((sum, sp) => sum + Number(sp.soLuong), 0);
  const tongGiaTriKho = danhSachSanPham.reduce((sum, sp) => sum + (Number(sp.soLuong) * Number(sp.giaNhap)), 0);
  const sapHetHang = danhSachSanPham.filter(sp => sp.soLuong > 0 && sp.soLuong <= sp.dinhMucToiThieu).length;
  const hetHang = danhSachSanPham.filter(sp => sp.soLuong <= 0).length;

  document.getElementById('dash-tong-sp').innerText = tongMatHang;
  document.getElementById('dash-tong-ton').innerText = tongSoLuongTon.toLocaleString('vi-VN');
  document.getElementById('dash-tong-gia-tri').innerText = formatTien(tongGiaTriKho);
  document.getElementById('dash-canh-bao').innerText = sapHetHang + hetHang;

  const listCanhBao = danhSachSanPham.filter(sp => sp.soLuong <= sp.dinhMucToiThieu);
  const tbody = document.getElementById('dash-table-canh-bao');
  if (!tbody) return;

  if (listCanhBao.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400">Kho hàng ở trạng thái an toàn, không có hàng sắp hết.</td></tr>`;
    return;
  }

  tbody.innerHTML = listCanhBao.map(sp => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition text-xs sm:text-sm">
      <td class="py-3 px-4 font-semibold text-slate-900">${sp.ten} (${sp.ma})</td>
      <td class="py-3 px-4 text-slate-500">${sp.kho}</td>
      <td class="py-3 px-4 font-bold ${sp.soLuong === 0 ? 'text-rose-600' : 'text-amber-600'}">${sp.soLuong} cái</td>
      <td class="py-3 px-4 text-slate-500">Tối thiểu: ${sp.dinhMucToiThieu}</td>
      <td class="py-3 px-4 text-right">
        <button onclick="moModalNhapKhoNhanh('${sp.ma}')" class="px-2.5 py-1 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 text-xs">
          + Nhập bù hàng
        </button>
      </td>
    </tr>
  `).join('');
}

// 6. HIỂN THỊ DANH SÁCH SẢN PHẨM (TỒN KHO)
function hienThiDanhSachSanPham() {
  const tuKhoa = (document.getElementById('tim-kiem-sp')?.value || '').toLowerCase();
  const locKho = document.getElementById('loc-kho')?.value || 'all';

  const listLoc = danhSachSanPham.filter(sp => {
    const matchTuKhoa = sp.ten.toLowerCase().includes(tuKhoa) || sp.ma.toLowerCase().includes(tuKhoa);
    const matchKho = locKho === 'all' || sp.kho === locKho;
    return matchTuKhoa && matchKho;
  });

  const tbody = document.getElementById('table-san-pham');
  if (!tbody) return;

  if (listLoc.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-slate-400">Không tìm thấy sản phẩm nào phù hợp.</td></tr>`;
    return;
  }

  tbody.innerHTML = listLoc.map(sp => {
    let badgeClass = 'badge-success';
    let badgeText = 'Còn hàng';
    if (sp.soLuong <= 0) {
      badgeClass = 'badge-danger';
      badgeText = 'Hết hàng';
    } else if (sp.soLuong <= sp.dinhMucToiThieu) {
      badgeClass = 'badge-warning';
      badgeText = 'Sắp hết';
    }

    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition text-xs sm:text-sm">
        <td class="py-3 px-4 font-bold text-purple-700">${sp.ma}</td>
        <td class="py-3 px-4 font-semibold text-slate-900">${sp.ten}</td>
        <td class="py-3 px-4 text-slate-500">${sp.nganhHang}</td>
        <td class="py-3 px-4 text-slate-600">${sp.kho} <br/><span class="text-[11px] text-slate-400">${sp.viTri}</span></td>
        <td class="py-3 px-4 font-bold text-slate-900">${sp.soLuong}</td>
        <td class="py-3 px-4 text-slate-600">${formatTien(sp.giaNhap)}</td>
        <td class="py-3 px-4 text-center">
          <span class="badge ${badgeClass}">${badgeText}</span>
        </td>
        <td class="py-3 px-4 text-right">
          <button onclick="xoaSanPham('${sp.id}')" class="text-rose-600 hover:underline text-xs font-semibold">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

function themSanPhamMoi(event) {
  event.preventDefault();
  const ma = document.getElementById('sp-ma').value.trim();
  const ten = document.getElementById('sp-ten').value.trim();
  const nganhHang = document.getElementById('sp-nganh-hang').value;
  const kho = document.getElementById('sp-kho').value;
  const soLuong = parseInt(document.getElementById('sp-so-luong').value) || 0;
  const giaNhap = parseInt(document.getElementById('sp-gia-nhap').value) || 0;
  const giaBan = parseInt(document.getElementById('sp-gia-ban').value) || 0;
  const viTri = document.getElementById('sp-vi-tri').value.trim() || 'Kệ mặc định';

  if (!ma || !ten) {
    alert('Vui lòng nhập đầy đủ Mã và Tên sản phẩm!');
    return;
  }

  if (danhSachSanPham.some(sp => sp.ma.toLowerCase() === ma.toLowerCase())) {
    alert(`Mã sản phẩm "${ma}" đã tồn tại trong kho!`);
    return;
  }

  const spMoi = {
    id: 'SP-' + Date.now(),
    ma,
    ten,
    nganhHang,
    kho,
    soLuong,
    dinhMucToiThieu: 10,
    giaNhap,
    giaBan,
    viTri
  };

  danhSachSanPham.unshift(spMoi);
  luuVaoLocalStorage();
  ghiNhatKy('THÊM SẢN PHẨM', ma, `Thêm mới mặt hàng "${ten}" với số lượng ban đầu: ${soLuong}`);

  dongModal('modal-them-sp');
  document.getElementById('form-them-sp').reset();
  hienThiDanhSachSanPham();
  hienThiDashboard();
  alert('Đã thêm sản phẩm thành công!');
}

function xoaSanPham(id) {
  const sp = danhSachSanPham.find(s => s.id === id);
  if (!sp) return;
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${sp.ten}" (${sp.ma}) khỏi kho?`)) {
    danhSachSanPham = danhSachSanPham.filter(s => s.id !== id);
    luuVaoLocalStorage();
    ghiNhatKy('XÓA SẢN PHẨM', sp.ma, `Đã xóa sản phẩm ${sp.ten} khỏi danh mục`);
    hienThiDanhSachSanPham();
    hienThiDashboard();
  }
}

// 7. NGHIỆP VỤ NHẬP KHO & XUẤT KHO
function hienThiDanhSachPhieuKho() {
  const tbody = document.getElementById('table-phieu-kho');
  if (!tbody) return;

  if (danhSachPhieuKho.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">Chưa có phiếu xuất/nhập kho nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = danhSachPhieuKho.map(p => {
    const isNhap = p.loai === 'inbound';
    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition text-xs sm:text-sm">
        <td class="py-3 px-4 font-bold text-slate-900">${p.ma}</td>
        <td class="py-3 px-4">
          <span class="badge ${isNhap ? 'badge-purple' : 'badge-info'}">
            ${isNhap ? '↓ Nhập kho' : '↑ Xuất kho'}
          </span>
        </td>
        <td class="py-3 px-4 font-medium text-slate-800">${p.tenDoiTac}</td>
        <td class="py-3 px-4 text-slate-500">${p.thoiGian}</td>
        <td class="py-3 px-4 font-bold text-slate-900">${p.soLuong} món</td>
        <td class="py-3 px-4 font-semibold text-slate-700">${formatTien(p.tongTien)}</td>
        <td class="py-3 px-4 text-slate-600">${p.nguoiTao}</td>
      </tr>
    `;
  }).join('');
}

function taoPhieuNhapKho(event) {
  event.preventDefault();
  const maSP = document.getElementById('nhap-ma-sp').value;
  const soLuong = parseInt(document.getElementById('nhap-so-luong').value) || 0;
  const doiTac = document.getElementById('nhap-doi-tac').value.trim() || 'Nhà cung cấp tổng hợp';

  if (soLuong <= 0) {
    alert('Số lượng nhập phải lớn hơn 0!');
    return;
  }

  const sp = danhSachSanPham.find(s => s.ma === maSP);
  if (!sp) {
    alert('Không tìm thấy sản phẩm!');
    return;
  }

  sp.soLuong += soLuong;

  const maPhieu = 'PNK-' + Date.now().toString().slice(-4);
  const tongTien = soLuong * sp.giaNhap;

  const phieuMoi = {
    id: maPhieu,
    ma: maPhieu,
    loai: 'inbound',
    tenDoiTac: doiTac,
    thoiGian: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
    soLuong,
    tongTien,
    trangThai: 'completed',
    nguoiTao: 'Nguyễn Văn An'
  };

  danhSachPhieuKho.unshift(phieuMoi);
  luuVaoLocalStorage();
  ghiNhatKy('NHẬP KHO', maPhieu, `Nhập +${soLuong} ${sp.ten} vào kho`);

  dongModal('modal-nhap-kho');
  hienThiDashboard();
  hienThiDanhSachSanPham();
  hienThiDanhSachPhieuKho();
  alert(`Đã lập phiếu nhập kho ${maPhieu} thành công! Tồn kho mới: ${sp.soLuong}`);
}

function taoPhieuXuatKho(event) {
  event.preventDefault();
  const maSP = document.getElementById('xuat-ma-sp').value;
  const soLuong = parseInt(document.getElementById('xuat-so-luong').value) || 0;
  const doiTac = document.getElementById('xuat-doi-tac').value.trim() || 'Khách hàng bán lẻ';

  if (soLuong <= 0) {
    alert('Số lượng xuất phải lớn hơn 0!');
    return;
  }

  const sp = danhSachSanPham.find(s => s.ma === maSP);
  if (!sp) {
    alert('Không tìm thấy sản phẩm!');
    return;
  }

  if (sp.soLuong < soLuong) {
    alert(`LỖI XUẤT KHO: Tồn kho hiện tại chỉ còn ${sp.soLuong} cái, không đủ để xuất ${soLuong} cái!`);
    return;
  }

  sp.soLuong -= soLuong;

  const maPhieu = 'PXK-' + Date.now().toString().slice(-4);
  const tongTien = soLuong * sp.giaBan;

  const phieuMoi = {
    id: maPhieu,
    ma: maPhieu,
    loai: 'outbound',
    tenDoiTac: doiTac,
    thoiGian: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
    soLuong,
    tongTien,
    trangThai: 'completed',
    nguoiTao: 'Trần Thị Mai'
  };

  danhSachPhieuKho.unshift(phieuMoi);
  luuVaoLocalStorage();
  ghiNhatKy('XUẤT KHO', maPhieu, `Xuất -${soLuong} ${sp.ten} cho ${doiTac}`);

  dongModal('modal-xuat-kho');
  hienThiDashboard();
  hienThiDanhSachSanPham();
  hienThiDanhSachPhieuKho();
  alert(`Đã lập phiếu xuất kho ${maPhieu} thành công! Số lượng còn lại: ${sp.soLuong}`);
}

// 8. PHÂN QUYỀN VÀ QUẢN LÝ NHÂN SỰ (RBAC)
function hienThiNhanSu() {
  const tbody = document.getElementById('table-nhan-su');
  if (!tbody) return;

  tbody.innerHTML = danhSachNhanSu.map(ns => {
    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition text-xs sm:text-sm">
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${ns.ten}</div>
          <div class="text-xs text-slate-400">${ns.email}</div>
        </td>
        <td class="py-3 px-4">
          <select onchange="doiVaiTroNhanSu('${ns.id}', this.value)" class="text-xs font-semibold rounded-lg px-2.5 py-1 border border-purple-200 bg-purple-50 text-purple-700 cursor-pointer focus:outline-none">
            <option value="admin" ${ns.vaiTro === 'admin' ? 'selected' : ''}>Quản trị viên (Admin)</option>
            <option value="manager" ${ns.vaiTro === 'manager' ? 'selected' : ''}>Quản lý kho (Manager)</option>
            <option value="staff" ${ns.vaiTro === 'staff' ? 'selected' : ''}>Thủ kho (Staff)</option>
            <option value="accountant" ${ns.vaiTro === 'accountant' ? 'selected' : ''}>Kế toán kho (Accountant)</option>
          </select>
        </td>
        <td class="py-3 px-4 text-slate-700 font-medium">${ns.boPhan}</td>
        <td class="py-3 px-4 text-slate-600">${ns.sdt}</td>
        <td class="py-3 px-4 text-center">
          <span class="badge ${ns.trangThai === 'active' ? 'badge-success' : 'badge-danger'}">
            ${ns.trangThai === 'active' ? 'Hoạt động' : 'Đã khóa'}
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="khoaMoKhoaNhanSu('${ns.id}')" class="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">
              ${ns.trangThai === 'active' ? 'Khóa' : 'Mở khóa'}
            </button>
            <button onclick="xoaNhanSu('${ns.id}')" class="text-xs px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold">
              Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function doiVaiTroNhanSu(id, vaiTroMoi) {
  const ns = danhSachNhanSu.find(u => u.id === id);
  if (!ns) return;

  const vaiTroCu = ns.vaiTro;
  ns.vaiTro = vaiTroMoi;
  luuVaoLocalStorage();
  ghiNhatKy('ĐỔI VAI TRÒ', ns.ten, `Chuyển vai trò từ "${vaiTroCu}" sang "${vaiTroMoi}"`);
  alert(`Đã cập nhật vai trò của ${ns.ten} thành "${vaiTroMoi}"!`);
}

function khoaMoKhoaNhanSu(id) {
  const ns = danhSachNhanSu.find(u => u.id === id);
  if (!ns) return;

  ns.trangThai = ns.trangThai === 'active' ? 'inactive' : 'active';
  luuVaoLocalStorage();
  ghiNhatKy('ĐỔI TRẠNG THÁI', ns.ten, `${ns.trangThai === 'active' ? 'Mở khóa' : 'Khóa'} tài khoản`);
  hienThiNhanSu();
}

function xoaNhanSu(id) {
  const ns = danhSachNhanSu.find(u => u.id === id);
  if (!ns) return;

  if (danhSachNhanSu.length <= 1) {
    alert('Không thể xóa tài khoản duy nhất còn lại!');
    return;
  }

  if (confirm(`Bạn có chắc chắn muốn xóa tài khoản của "${ns.ten}" (${ns.email})?`)) {
    danhSachNhanSu = danhSachNhanSu.filter(u => u.id !== id);
    luuVaoLocalStorage();
    ghiNhatKy('XÓA NHÂN SỰ', ns.ten, `Đã xóa tài khoản khỏi hệ thống`);
    hienThiNhanSu();
    alert('Đã xóa tài khoản thành công!');
  }
}

function themNhanSuMoi(event) {
  event.preventDefault();
  const ten = document.getElementById('ns-ten').value.trim();
  const email = document.getElementById('ns-email').value.trim();
  const sdt = document.getElementById('ns-sdt').value.trim();
  const boPhan = document.getElementById('ns-bo-phan').value.trim() || 'Kho Vận';
  const vaiTro = document.getElementById('ns-vai-tro').value;

  if (!ten || !email) {
    alert('Vui lòng nhập tên và email!');
    return;
  }

  const nsMoi = {
    id: 'NS-' + Date.now(),
    ten,
    email,
    sdt: sdt || 'Chưa cập nhật',
    boPhan,
    vaiTro,
    trangThai: 'active'
  };

  danhSachNhanSu.push(nsMoi);
  luuVaoLocalStorage();
  ghiNhatKy('TẠO NHÂN SỰ', ten, `Thêm tài khoản mới với vai trò ${vaiTro}`);

  dongModal('modal-them-ns');
  document.getElementById('form-them-ns').reset();
  hienThiNhanSu();
  alert('Đã tạo tài khoản nhân sự mới!');
}

// 9. NHẬT KÝ KIỂM TOÁN
function hienThiNhatKy() {
  const tbody = document.getElementById('table-nhat-ky');
  if (!tbody) return;

  tbody.innerHTML = danhSachNhatKy.map(nk => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition text-xs sm:text-sm">
      <td class="py-3 px-4 font-mono text-slate-500">${nk.thoiGian}</td>
      <td class="py-3 px-4 font-semibold text-slate-900">${nk.nguoiThucHien} <br/><span class="text-[11px] text-slate-400 font-normal">${nk.vaiTro}</span></td>
      <td class="py-3 px-4">
        <span class="badge ${nk.hanhDong.includes('XÓA') ? 'badge-danger' : nk.hanhDong.includes('NHẬP') ? 'badge-purple' : 'badge-info'}">
          ${nk.hanhDong}
        </span>
      </td>
      <td class="py-3 px-4 font-bold text-slate-800">${nk.doiTuong}</td>
      <td class="py-3 px-4 text-slate-600">${nk.chiTiet}</td>
    </tr>
  `).join('');
}

// 10. MODAL UTILITIES
function moModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('hidden');

  if (id === 'modal-nhap-kho' || id === 'modal-xuat-kho') {
    const selectEl = document.getElementById(id === 'modal-nhap-kho' ? 'nhap-ma-sp' : 'xuat-ma-sp');
    if (selectEl) {
      selectEl.innerHTML = danhSachSanPham.map(sp => `
        <option value="${sp.ma}">${sp.ten} (${sp.ma}) - Tồn: ${sp.soLuong}</option>
      `).join('');
    }
  }
}

function dongModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('hidden');
}

function moModalNhapKhoNhanh(maSP) {
  moModal('modal-nhap-kho');
  const select = document.getElementById('nhap-ma-sp');
  if (select) select.value = maSP;
}

function datLaiDuLieuGoc() {
  if (confirm('Bạn có chắc muốn xóa dữ liệu chỉnh sửa và đưa về danh sách mẫu ban đầu không?')) {
    localStorage.removeItem('sf_sanPham');
    localStorage.removeItem('sf_phieuKho');
    localStorage.removeItem('sf_nhanSu');
    localStorage.removeItem('sf_nhatKy');
    location.reload();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  hienThiDashboard();
  hienThiDanhSachSanPham();
  hienThiDanhSachPhieuKho();
  hienThiNhanSu();
  hienThiNhatKy();
});
