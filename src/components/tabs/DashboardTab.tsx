import React from 'react';
import { useApp } from '../../context/AppContext';
import { dinhDangSo, dinhDangTien, PHAN_QUYEN_HE_THONG } from '../../services/store';
import {
  Boxes,
  Layers,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine
} from 'lucide-react';

export const DashboardTab: React.FC = () => {
  const { sanPhamList, phieuList, setActiveTab, currentUser } = useApp();
  const roleInfo = PHAN_QUYEN_HE_THONG[currentUser.vaiTro] || PHAN_QUYEN_HE_THONG.staff;
  const canAccessInbound = roleInfo.trangDuocPhep.includes('nhap-kho');
  const canAccessOutbound = roleInfo.trangDuocPhep.includes('xuat-kho');

  // Metrics
  const tongMaHang = sanPhamList.length;
  const tongTonThucTe = sanPhamList.reduce((acc, p) => acc + (p.soLuong || 0), 0);
  const tongGiaTriVon = sanPhamList.reduce((acc, p) => acc + (p.soLuong || 0) * (p.giaNhap || 0), 0);
  const danhSachCanhBao = sanPhamList.filter(p => (p.soLuong || 0) <= (p.dinhMucToiThieu || 0));

  // Branch breakdown
  const branches = ['Kho Tổng Hà Nội', 'Kho Chi nhánh Bình Dương', 'Kho Đà Nẵng'];
  const branchStats = branches.map(kho => {
    const prods = sanPhamList.filter(p => p.kho === kho);
    const tonKho = prods.reduce((acc, p) => acc + (p.soLuong || 0), 0);
    const giaTri = prods.reduce((acc, p) => acc + (p.soLuong || 0) * (p.giaNhap || 0), 0);
    const percentage = tongTonThucTe > 0 ? Math.round((tonKho / tongTonThucTe) * 100) : 0;
    return {
      kho,
      count: prods.length,
      tonKho,
      giaTri,
      percentage
    };
  });

  // Recent transactions (last 6)
  const phieuGanDay = [...phieuList].slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tổng mã hàng */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng mã hàng
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shadow-2xs">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{dinhDangSo(tongMaHang)}</p>
          <p className="text-xs text-slate-400 mt-1">Đang hoạt động trong danh mục</p>
        </div>

        {/* KPI 2: Tổng tồn thực tế */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng tồn thực tế
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{dinhDangSo(tongTonThucTe)}</p>
          <p className="text-xs text-slate-400 mt-1">Đơn vị lưu kho khả dụng</p>
        </div>

        {/* KPI 3: Giá trị tiền hàng (Vốn) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Giá trị tiền hàng (Vốn)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-2xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{dinhDangTien(tongGiaTriVon)}</p>
          <p className="text-xs text-slate-400 mt-1">Tính theo giá vốn nhập kho</p>
        </div>

        {/* KPI 4: Cảnh báo hết/sắp hết */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cảnh báo hết/sắp hết
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shadow-2xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">{dinhDangSo(danhSachCanhBao.length)}</p>
          <p className="text-xs text-rose-500 mt-1 font-medium">Mặt hàng dưới định mức an toàn</p>
        </div>
      </div>

      {/* Khối Cảnh báo tồn kho an toàn */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              Danh sách mặt hàng cần nhập bổ sung khẩn cấp
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('hang-hoa')}
            className="text-xs text-purple-700 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Xem toàn bộ kho</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {danhSachCanhBao.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Hiện tại tất cả mặt hàng đều đạt định mức tồn kho an toàn!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 font-bold">Mã SKU</th>
                  <th className="py-3 px-4 font-bold">Tên sản phẩm</th>
                  <th className="py-3 px-4 font-bold">Danh mục</th>
                  <th className="py-3 px-4 font-bold">Kho hàng</th>
                  <th className="py-3 px-4 font-bold text-center">Tồn kho / Định mức</th>
                  <th className="py-3 px-4 font-bold text-center">Trạng thái</th>
                  <th className="py-3 px-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {danhSachCanhBao.map(prod => {
                  const hetHang = prod.soLuong === 0;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-purple-900">{prod.sku}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{prod.ten}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {prod.danhMuc || 'Khác'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{prod.kho}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-slate-900">{prod.soLuong}</span>
                        <span className="text-slate-400"> / {prod.dinhMucToiThieu} {prod.donVi}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hetHang ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            Đã hết hàng (0)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Sắp hết ({prod.soLuong} còn lại)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {canAccessInbound ? (
                          <button
                            onClick={() => setActiveTab('nhap-kho')}
                            className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg font-semibold text-[11px] transition shadow-2xs cursor-pointer"
                          >
                            Lập phiếu nhập
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveTab('hang-hoa')}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] transition cursor-pointer"
                          >
                            Xem tồn kho
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Two Columns: Branch distribution & Recent Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-purple-700" />
            <h3 className="font-bold text-slate-800 text-sm">Phân bổ hàng theo kho chi nhánh</h3>
          </div>

          <div className="space-y-4">
            {branchStats.map(item => (
              <div key={item.kho} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-800">{item.kho}</div>
                  <div className="font-semibold text-purple-800">{item.percentage}% tổng tồn</div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>{item.count} mặt hàng &bull; {dinhDangSo(item.tonKho)} sản phẩm</span>
                  <span className="font-bold text-slate-700">{dinhDangTien(item.giaTri)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-slate-800 text-sm">Lịch sử phiếu gần đây</h3>
            </div>
            {(canAccessInbound || canAccessOutbound) && (
              <div className="flex items-center gap-2 text-xs font-semibold">
                {canAccessInbound && (
                  <button
                    onClick={() => setActiveTab('nhap-kho')}
                    className="text-emerald-700 hover:underline cursor-pointer"
                  >
                    Phiếu nhập &rarr;
                  </button>
                )}
                {canAccessInbound && canAccessOutbound && (
                  <span className="text-slate-300">|</span>
                )}
                {canAccessOutbound && (
                  <button
                    onClick={() => setActiveTab('xuat-kho')}
                    className="text-rose-700 hover:underline cursor-pointer"
                  >
                    Phiếu xuất &rarr;
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {phieuGanDay.map(phieu => {
              const isNhap = phieu.loai === 'nhap';
              return (
                <div
                  key={phieu.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isNhap ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isNhap ? <ArrowDownToLine className="w-3.5 h-3.5" /> : <ArrowUpFromLine className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{phieu.maPhieu}</span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="font-medium text-slate-700 truncate max-w-[140px] sm:max-w-[200px]">
                          {phieu.doiTac}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{phieu.thoiGian}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold ${isNhap ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {isNhap ? '+' : '-'}{dinhDangTien(phieu.tongTien)}
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        phieu.trangThai === 'thanh_cong'
                          ? 'bg-emerald-50 text-emerald-700'
                          : phieu.trangThai === 'dang_van_chuyen'
                          ? 'bg-blue-50 text-blue-700'
                          : phieu.trangThai === 'cho_duyet'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {phieu.trangThai === 'thanh_cong'
                        ? 'Hoàn thành'
                        : phieu.trangThai === 'dang_van_chuyen'
                        ? 'Đang giao'
                        : phieu.trangThai === 'cho_duyet'
                        ? 'Chờ duyệt'
                        : 'Trả hàng'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
