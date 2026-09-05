// =============================================================================
// STOCKFLOW NAV - THANH ĐIỀU HƯỚNG VÀ HEADER DÙNG CHUNG KÈM PHÂN QUYỀN RBAC
// Tự động kiểm soát quyền truy cập trang (Route Guard) và giao diện theo vai trò
// =============================================================================

const PHAN_QUYEN_HE_THONG = {
  admin: {
    ten: 'Quản trị viên (Admin)',
    badge: 'bg-rose-100 text-rose-700 border border-rose-200',
    bieuTuong: '👑',
    trangDuocPhep: ['tong-quan', 'hang-hoa', 'nhap-xuat', 'nha-cung-cap', 'nhan-su', 'nhat-ky'],
    moTa: 'Toàn quyền 100%: Quản lý hàng hóa, tài chính, phân quyền nhân sự và kiểm toán'
  },
  manager: {
    ten: 'Quản lý kho (Manager)',
    badge: 'bg-purple-100 text-purple-700 border border-purple-200',
    bieuTuong: '💼',
    trangDuocPhep: ['tong-quan', 'hang-hoa', 'nhap-xuat', 'nha-cung-cap', 'nhat-ky'],
    moTa: 'Điều hành kho, duyệt phiếu, theo dõi NCC & nhật ký (hạn chế đổi phân quyền nhân sự)'
  },
  accountant: {
    ten: 'Kế toán kho (Accountant)',
    badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    bieuTuong: '📊',
    trangDuocPhep: ['tong-quan', 'hang-hoa', 'nhap-xuat', 'nha-cung-cap'],
    moTa: 'Xem doanh số, giá vốn, đối soát phiếu nhập xuất, theo dõi công nợ nhà cung cấp'
  },
  staff: {
    ten: 'Thủ kho (Staff)',
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    bieuTuong: '📦',
    trangDuocPhep: ['tong-quan', 'hang-hoa', 'nhap-xuat'],
    moTa: 'Thực hiện kiểm đếm vị trí kệ, lập phiếu nhập hàng, xuất kho hàng ngày'
  }
};

function chuyenNhanhVaiTro(vaiTroMoi) {
  const currentUser = StockStore.getCurrentUser() || { id: 'u_1', ten: 'Người dùng' };
  currentUser.vaiTro = vaiTroMoi;
  StockStore.setCurrentUser(currentUser);
  
  // Cập nhật cả trong danh sách nhân sự
  let danhSach = StockStore.getNhanSu();
  const index = danhSach.findIndex(u => u.id === currentUser.id);
  if (index !== -1) {
    danhSach[index].vaiTro = vaiTroMoi;
    StockStore.setNhanSu(danhSach);
  }

  StockStore.ghiNhatKy('CHUYỂN VAI TRÒ DEMO', currentUser.ten, `Đổi vai trò phiên làm việc sang: ${vaiTroMoi.toUpperCase()}`);
  
  // Nếu trang hiện tại không được phép cho vai trò mới, tự động về index.html
  const duocPhep = PHAN_QUYEN_HE_THONG[vaiTroMoi]?.trangDuocPhep.includes(window.TRANG_HIEN_TAI || 'tong-quan');
  if (!duocPhep) {
    window.location.href = 'index.html';
  } else {
    window.location.reload();
  }
}

function khoiTaoGiaoDienChung(trangHienTai) {
  window.TRANG_HIEN_TAI = trangHienTai;
  const user = StockStore.getCurrentUser();
  const vaiTro = user?.vaiTro || 'staff';
  const roleInfo = PHAN_QUYEN_HE_THONG[vaiTro] || PHAN_QUYEN_HE_THONG.staff;
  const trangDuocPhep = roleInfo.trangDuocPhep;

  const danhMucCacTrang = [
    { ma: 'tong-quan', file: 'index.html', icon: '📊', ten: '1. Tổng quan kho', vaiTroToiThieu: 'staff' },
    { ma: 'hang-hoa', file: 'hang-hoa.html', icon: '📦', ten: '2. Hàng hóa & Tồn kho', vaiTroToiThieu: 'staff' },
    { ma: 'nhap-xuat', file: 'nhap-xuat.html', icon: '🔄', ten: '3. Phiếu Nhập / Xuất kho', vaiTroToiThieu: 'staff' },
    { ma: 'nha-cung-cap', file: 'nha-cung-cap.html', icon: '🏭', ten: '4. Nhà cung cấp & Đối tác', vaiTroToiThieu: 'accountant', yeuCau: 'Chỉ Admin/Kế toán/Quản lý' },
    { ma: 'nhan-su', file: 'nhan-su.html', icon: '👥', ten: '5. Nhân sự & Phân quyền', vaiTroToiThieu: 'admin', yeuCau: 'Chỉ Quản trị viên (Admin)' },
    { ma: 'nhat-ky', file: 'nhat-ky.html', icon: '📜', ten: '6. Nhật ký kiểm toán', vaiTroToiThieu: 'manager', yeuCau: 'Chỉ Admin & Quản lý' }
  ];

  // ==========================================
  // 1. RENDER SIDEBAR VỚI GIAO DIỆN PHÂN QUYỀN
  // ==========================================
  const sidebarEl = document.getElementById('app-sidebar');
  if (sidebarEl) {
    sidebarEl.innerHTML = `
      <div class="p-5 border-b border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-200">
            📦
          </div>
          <div>
            <h1 class="text-base font-bold text-slate-900 leading-tight">STOCKFLOW</h1>
            <p class="text-[11px] text-purple-600 font-semibold tracking-wider">KHO HÀNG ĐA CHI NHÁNH</p>
          </div>
        </div>
      </div>

      <!-- Trạng thái phân quyền hiện tại -->
      <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Vai trò RBAC:</span>
        <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${roleInfo.badge}">
          <span>${roleInfo.bieuTuong}</span>
          <span>${roleInfo.ten.split(' ')[0]}</span>
        </span>
      </div>

      <!-- Menu các trang có kiểm tra quyền -->
      <div class="p-3 flex-1 overflow-y-auto">
        <p class="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">DANH MỤC TRANG WEB</p>
        <nav class="space-y-1">
          ${danhMucCacTrang.map(trang => {
            const coQuyen = trangDuocPhep.includes(trang.ma);
            const dangChon = trangHienTai === trang.ma;

            if (coQuyen) {
              return `
                <a href="${trang.file}" class="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${dangChon ? 'bg-purple-100 text-purple-900 font-bold shadow-xs' : 'text-slate-700 hover:bg-slate-100'}">
                  <div class="flex items-center gap-2.5">
                    <span class="text-base">${trang.icon}</span>
                    <span>${trang.ten}</span>
                  </div>
                </a>
              `;
            } else {
              // Bị hạn chế quyền: hiển thị biểu tượng khóa và chú thích
              return `
                <div title="${trang.yeuCau}" class="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 bg-slate-50/70 border border-dashed border-slate-200 opacity-60 cursor-not-allowed select-none">
                  <div class="flex items-center gap-2.5">
                    <span class="text-base grayscale opacity-50">${trang.icon}</span>
                    <span class="line-through">${trang.ten}</span>
                  </div>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold" title="Quyền hạn bị hạn chế">🔒 Khóa</span>
                </div>
              `;
            }
          }).join('')}
        </nav>
      </div>

      <!-- Khối tài khoản & Chuyển vai trò nhanh ở cuối sidebar -->
      <div class="p-3 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl space-y-2">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center text-xs">
            ${user?.ten ? user.ten.charAt(0) : 'U'}
          </div>
          <div class="overflow-hidden flex-1">
            <p class="text-xs font-bold text-slate-800 truncate">${user?.ten || 'Chưa đăng nhập'}</p>
            <p class="text-[10px] text-slate-500 truncate">${roleInfo.ten}</p>
          </div>
        </div>

        <!-- Bộ chuyển vai trò kiểm thử nhanh (Demo RBAC) -->
        <div>
          <label class="block text-[10px] font-bold text-purple-800 uppercase mb-1">⚡ Thử đổi vai trò kiểm tra quyền:</label>
          <select onchange="chuyenNhanhVaiTro(this.value)" class="w-full px-2 py-1.5 rounded-lg border border-purple-200 text-xs font-semibold bg-white text-purple-900 focus:ring-2 focus:ring-purple-600 shadow-2xs">
            <option value="admin" ${vaiTro === 'admin' ? 'selected' : ''}>👑 1. Quản trị viên (Admin)</option>
            <option value="manager" ${vaiTro === 'manager' ? 'selected' : ''}>💼 2. Quản lý kho (Manager)</option>
            <option value="staff" ${vaiTro === 'staff' ? 'selected' : ''}>📦 3. Thủ kho (Staff)</option>
            <option value="accountant" ${vaiTro === 'accountant' ? 'selected' : ''}>📊 4. Kế toán (Accountant)</option>
          </select>
        </div>

        <div class="flex items-center gap-1.5 pt-1">
          <a href="dang-nhap.html" class="flex-1 text-center py-1.5 px-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition">
            Đổi tài khoản
          </a>
          <button onclick="StockStore.datLaiMacDinh(); location.reload();" title="Đặt lại dữ liệu gốc ban đầu" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-slate-200 transition">
            🔄
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 2. RENDER HEADER DÙNG CHUNG
  // ==========================================
  const headerEl = document.getElementById('app-header');
  if (headerEl) {
    const tieuDeTrangMap = {
      'tong-quan': { tieuDe: '1. Tổng quan & Báo cáo điều hành', moTa: 'Thống kê lượng hàng, tồn kho, cảnh báo định mức thời gian thực' },
      'hang-hoa': { tieuDe: '2. Quản lý Danh mục Hàng hóa & Tồn kho', moTa: 'Tra cứu SKU, số lượng tồn, giá vốn, vị trí kệ hàng' },
      'nhap-xuat': { tieuDe: '3. Quản lý Phiếu Nhập - Xuất kho', moTa: 'Lập phiếu nhập thêm hàng hoặc xuất bán chống xuất âm' },
      'nha-cung-cap': { tieuDe: '4. Quản lý Nhà cung cấp & Đối tác', moTa: 'Thông tin liên hệ, công nợ và nhà phân phối chiến lược' },
      'nhan-su': { tieuDe: '5. Phân quyền & Quản lý Nhân sự', moTa: 'Phân quyền tài khoản theo vai trò (Admin, Quản lý, Thủ kho, Kế toán)' },
      'nhat-ky': { tieuDe: '6. Nhật ký kiểm toán & Lịch sử thao tác', moTa: 'Ghi vết hành động (Audit Trail) phục vụ đối soát và nộp bài tập' }
    };
    const info = tieuDeTrangMap[trangHienTai] || { tieuDe: 'Hệ thống Kho Vận', moTa: 'StockFlow - Quản lý kho hàng chuyên nghiệp' };

    headerEl.innerHTML = `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 gap-3">
        <div>
          <h2 class="text-base font-bold text-slate-900">${info.tieuDe}</h2>
          <p class="text-xs text-slate-500">${info.moTa}</p>
        </div>
        <div class="flex items-center gap-2.5 self-end sm:self-center">
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-xl text-xs">
            <span class="text-slate-500">Quyền:</span>
            <span class="font-bold text-purple-900">${roleInfo.bieuTuong} ${roleInfo.ten}</span>
          </div>
          <a href="dang-nhap.html" class="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-purple-700 bg-slate-100 hover:bg-purple-50 border border-slate-200 px-3 py-1.5 rounded-xl transition">
            <span>👤 ${user?.ten || 'Khách'}</span>
          </a>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 3. ROUTE GUARD: KIỂM TRA QUYỀN TRUY CẬP TRANG
  // ==========================================
  const duocPhepTruyCap = trangDuocPhep.includes(trangHienTai);
  if (!duocPhepTruyCap) {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.innerHTML = `
        <div class="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-5">
          <div class="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto">
            ⛔
          </div>
          <div>
            <span class="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
              Lỗi 403 - Quyền truy cập bị từ chối
            </span>
            <h2 class="text-xl font-bold text-slate-900">Bạn không có quyền xem trang này!</h2>
            <p class="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Tài khoản hiện tại của bạn là <b>${user?.ten}</b> với vai trò <span class="font-bold text-rose-700">${roleInfo.ten}</span>.
              Theo ma trận phân quyền (RBAC) của đồ án, vai trò của bạn bị giới hạn và không được phép truy cập vào chức năng này.
            </p>
          </div>

          <!-- Bảng giải thích quyền hạn của vai trò hiện tại -->
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <p class="font-bold text-slate-800">Các trang bạn ĐƯỢC PHÉP truy cập với vai trò hiện tại:</p>
            <div class="flex flex-wrap gap-2">
              ${trangDuocPhep.map(m => {
                const item = danhMucCacTrang.find(t => t.ma === m);
                return `<a href="${item?.file}" class="px-2.5 py-1 bg-white border border-slate-200 text-purple-700 rounded-lg font-semibold hover:border-purple-300">${item?.icon} ${item?.ten}</a>`;
              }).join('')}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="index.html" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition">
              ⬅️ Quay lại Trang Tổng quan
            </a>
            <button onclick="chuyenNhanhVaiTro('admin')" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-200 transition">
              👑 Chuyển nhanh sang Admin (Để mở khóa xem thử)
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Hàm hiển thị thông báo popup nhỏ (Toast)
function hienThongBao(noiDung, loai = 'success') {
  const container = document.getElementById('toast-container') || (() => {
    const el = document.createElement('div');
    el.id = 'toast-container';
    el.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(el);
    return el;
  })();

  const toast = document.createElement('div');
  const bgClass = loai === 'success' ? 'bg-emerald-600' : loai === 'error' ? 'bg-rose-600' : 'bg-slate-800';
  toast.className = `${bgClass} text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg transform transition-all duration-300 translate-y-4 opacity-0 flex items-center gap-2 pointer-events-auto`;
  toast.innerHTML = `<span>${loai === 'success' ? '✅' : loai === 'error' ? '❌' : 'ℹ️'}</span> <span>${noiDung}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
