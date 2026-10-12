import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockStore, dinhDangSo, dinhDangTien } from '../../services/store';
import { StockExcel } from '../../services/excel';
import { api } from '../../services/api';
import { ChiTietPhieuHang, PhieuHang, PhieuTrangThai } from '../../types';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  FileSpreadsheet,
  Plus,
  Search,
  X,
  Printer,
  Eye,
  RotateCcw,
  Trash2,
  Truck,
  Building,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const ReceiptOutboundTab: React.FC = () => {
  const { phieuList, sanPhamList, currentUser, setActiveTab, refreshAll, showToast } =
    useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'tat-ca' | PhieuTrangThai>('tat-ca');
  const [warehouseFilter, setWarehouseFilter] = useState('tat-ca');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailPhieu, setDetailPhieu] = useState<PhieuHang | null>(null);
  const [returnPhieu, setReturnPhieu] = useState<PhieuHang | null>(null);
  const [returnReason, setReturnReason] = useState('');

  // New Outbound Receipt State
  const [newReceipt, setNewReceipt] = useState<{
    doiTac: string;
    dvVanChuyen: string;
    maVanDon: string;
    kho: string;
    ghiChu: string;
    items: ChiTietPhieuHang[];
  }>({
    doiTac: 'Hệ thống CellphoneS',
    dvVanChuyen: 'Shopee Xpress (SPX)',
    maVanDon: 'SPXVN' + Math.floor(1000000 + Math.random() * 9000000),
    kho: 'Kho Tổng Hà Nội',
    ghiChu: 'Xuất hàng chuỗi bán lẻ theo đơn đặt hàng',
    items: [
      {
        spId: sanPhamList[0]?.id || '',
        sku: sanPhamList[0]?.sku || 'SKU-SAMPLE',
        ten: sanPhamList[0]?.ten || 'Sản phẩm mẫu',
        donVi: sanPhamList[0]?.donVi || 'Chiếc',
        soLuong: 1,
        donGia: sanPhamList[0]?.giaXuat || 12000000,
        thanhTien: sanPhamList[0]?.giaXuat || 12000000
      }
    ]
  });

  // Calculate Outbound Stats
  const phieuXuatList = phieuList.filter(p => p.loai === 'xuat');
  const phieuNhapCount = phieuList.filter(p => p.loai === 'nhap').length;

  const tongTienXuat = phieuXuatList.reduce((acc, p) => acc + (p.tongTien || 0), 0);
  const soPhieuXuat = phieuXuatList.length;
  const tongSlXuat = phieuXuatList.reduce((acc, p) => acc + (p.soLuong || 0), 0);
  const uniqueKhach = new Set(phieuXuatList.map(p => p.doiTac)).size;

  // Filter receipts
  const filteredReceipts = phieuXuatList.filter(p => {
    const matchStatus = statusFilter === 'tat-ca' || p.trangThai === statusFilter;
    const matchWarehouse = warehouseFilter === 'tat-ca' || p.kho === warehouseFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      q === '' ||
      p.maPhieu.toLowerCase().includes(q) ||
      p.doiTac.toLowerCase().includes(q) ||
      (p.maVanDon && p.maVanDon.toLowerCase().includes(q)) ||
      (p.tenHang && p.tenHang.toLowerCase().includes(q));

    return matchStatus && matchWarehouse && matchSearch;
  });

  // Add Item to creation table
  const handleAddItemRow = () => {
    const firstProd = sanPhamList[0];
    const newItem: ChiTietPhieuHang = {
      spId: firstProd?.id || '',
      sku: firstProd?.sku || '',
      ten: firstProd?.ten || '',
      donVi: firstProd?.donVi || 'Chiếc',
      soLuong: 1,
      donGia: firstProd?.giaXuat || 0,
      thanhTien: firstProd?.giaXuat || 0
    };
    setNewReceipt(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleRemoveItemRow = (index: number) => {
    if (newReceipt.items.length <= 1) {
      showToast('Phiếu xuất phải có ít nhất 1 mặt hàng!', 'error');
      return;
    }
    setNewReceipt(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index)
    }));
  };

  const handleItemProductChange = (index: number, prodId: string) => {
    const prod = sanPhamList.find(p => p.id === prodId);
    if (!prod) return;

    setNewReceipt(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        spId: prod.id,
        sku: prod.sku,
        ten: prod.ten,
        donVi: prod.donVi,
        soLuong: 1,
        donGia: prod.giaXuat,
        thanhTien: prod.giaXuat
      };
      return { ...prev, items: newItems };
    });
  };

  const handleItemQtyPriceChange = (
    index: number,
    qty: number,
    price: number
  ) => {
    setNewReceipt(prev => {
      const newItems = [...prev.items];
      const validQty = Math.max(1, qty);
      const validPrice = Math.max(0, price);
      newItems[index] = {
        ...newItems[index],
        soLuong: validQty,
        donGia: validPrice,
        thanhTien: validQty * validPrice
      };
      return { ...prev, items: newItems };
    });
  };

  const calculateReceiptTotals = () => {
    const totalQty = newReceipt.items.reduce((acc, item) => acc + item.soLuong, 0);
    const grandTotal = newReceipt.items.reduce((acc, item) => acc + item.thanhTien, 0);
    return { totalQty, grandTotal };
  };

  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReceipt.items.length === 0) {
      showToast('Vui lòng thêm ít nhất một mặt hàng!', 'error');
      return;
    }

    // STRICT STOCK CHECK: Verify that stock is sufficient in warehouse
    for (const item of newReceipt.items) {
      const prod = sanPhamList.find(p => p.id === item.spId || p.sku === item.sku);
      if (prod) {
        if (prod.soLuong < item.soLuong) {
          showToast(
            `Không thể xuất: Sản phẩm "${prod.ten}" hiện chỉ còn tồn ${prod.soLuong}, không đủ để xuất ${item.soLuong}!`,
            'error'
          );
          return;
        }
      }
    }

    const { totalQty, grandTotal } = calculateReceiptTotals();
    const itemNames = newReceipt.items.map(i => i.ten).join(', ');

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const nextSeq = phieuXuatList.length + 1;
    const maPhieu = `XK-${now.getFullYear()}-${nextSeq.toString().padStart(3, '0')}`;

    const receiptPayload = {
      maPhieu,
      loai: 'xuat' as const,
      trangThai: 'thanh_cong' as const,
      dvVanChuyen: newReceipt.dvVanChuyen,
      maVanDon: newReceipt.maVanDon,
      doiTac: newReceipt.doiTac,
      kho: newReceipt.kho,
      tenHang: itemNames,
      soLuong: totalQty,
      tongTien: grandTotal,
      thoiGian: timeStr,
      nguoiLap: currentUser.ten,
      ghiChu: newReceipt.ghiChu,
      danhSachHang: newReceipt.items
    };

    StockStore.themPhieu(receiptPayload, true);
    api.createReceipt(receiptPayload).catch(e => console.warn('[MySQL Sync] Lỗi tạo phiếu xuất:', e));

    refreshAll();
    setIsCreateModalOpen(false);
    showToast(`Đã lập thành công phiếu xuất ${maPhieu} và trừ tồn kho an toàn!`, 'success');
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnPhieu) return;

    const res = StockStore.traHangPhieu(returnPhieu.id, returnReason, currentUser.ten);
    if (res.thanhCong) {
      refreshAll();
      setReturnPhieu(null);
      setReturnReason('');
      showToast(
        `Đã ghi nhận khách hoàn hàng cho phiếu ${returnPhieu.maPhieu}, tồn kho đã được cộng hoàn!`,
        'success'
      );
    } else {
      showToast(res.thongBao || 'Lỗi trả hàng', 'error');
    }
  };

  const handleDeleteReceipt = (phieu: PhieuHang) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa phiếu xuất ${phieu.maPhieu}?\nTồn kho của các mặt hàng sẽ được cộng hoàn lại vào kho.`
      )
    ) {
      StockStore.xoaPhieu(phieu.id, true);
      refreshAll();
      showToast(`Đã xóa phiếu ${phieu.maPhieu} và hoàn tác tồn kho!`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Tab Switcher: Phiếu nhập vs Phiếu xuất */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold shadow-2xs">
            <span>Phiếu hàng:</span>
          </div>

          <button
            onClick={() => setActiveTab('nhap-kho')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200"
          >
            <span>Phiếu nhập</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
              {phieuNhapCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('xuat-kho')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition bg-rose-600 text-white shadow-xs"
          >
            <span>Phiếu xuất</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">
              {soPhieuXuat}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 italic hidden md:block">
          Quản lý toàn bộ danh sách phiếu xuất kho, giao đại lý & kiểm soát chống xuất âm
        </div>
      </div>

      {/* 4 Outbound Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Tổng doanh thu xuất hàng</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shadow-2xs">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{dinhDangTien(tongTienXuat)}</p>
          <span className="text-[10px] text-rose-600 font-semibold">
            Toàn bộ giá trị xuất kho
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Tổng số phiếu xuất</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shadow-2xs">
              <ArrowUpFromLine className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{soPhieuXuat}</p>
          <span className="text-[10px] text-purple-600 font-semibold">
            Chứng từ xuất kho (Outbound)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Tổng số lượng xuất đi</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shadow-2xs">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{dinhDangSo(tongSlXuat)}</p>
          <span className="text-[10px] text-blue-600 font-semibold">
            Sản phẩm đã phân phối đi
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Khách hàng / Đại lý nhận</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shadow-2xs">
              <Building className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{uniqueKhach}</p>
          <span className="text-[10px] text-amber-600 font-semibold">
            Đối tác và chi nhánh nhận hàng
          </span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Status buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {[
              { id: 'tat-ca', label: 'Tất cả phiếu' },
              { id: 'thanh_cong', label: 'Thành công' },
              { id: 'dang_van_chuyen', label: 'Đang vận chuyển' },
              { id: 'cho_duyet', label: 'Chờ duyệt' },
              { id: 'tra_hang', label: 'Trả hàng' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === tab.id
                    ? 'bg-rose-100 text-rose-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <button
              onClick={() => StockExcel.xuatBaoCaoPhieu('xuat', warehouseFilter)}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Lập phiếu xuất</span>
            </button>
          </div>
        </div>

        {/* Search & Warehouse filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã phiếu, đối tác/khách hàng, mã vận đơn hoặc tên hàng..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={warehouseFilter}
            onChange={e => setWarehouseFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
          >
            <option value="tat-ca">Tất cả chi nhánh kho</option>
            <option value="Kho Tổng Hà Nội">Kho Tổng Hà Nội</option>
            <option value="Kho Chi nhánh Bình Dương">Kho Chi nhánh Bình Dương</option>
            <option value="Kho Đà Nẵng">Kho Đà Nẵng</option>
          </select>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Mã phiếu</th>
                <th className="py-3.5 px-4 font-bold">Thời gian</th>
                <th className="py-3.5 px-4 font-bold">Khách hàng / Đại lý</th>
                <th className="py-3.5 px-4 font-bold">Vận chuyển</th>
                <th className="py-3.5 px-4 font-bold">Kho xuất</th>
                <th className="py-3.5 px-4 font-bold text-center">Tổng SL</th>
                <th className="py-3.5 px-4 font-bold text-right">Tổng tiền</th>
                <th className="py-3.5 px-4 font-bold text-center">Trạng thái</th>
                <th className="py-3.5 px-4 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Không có phiếu xuất kho nào thỏa mãn điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredReceipts.map(phieu => {
                  const isTraHang = phieu.trangThai === 'tra_hang';

                  return (
                    <tr key={phieu.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-800">
                        {phieu.maPhieu}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {phieu.thoiGian}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{phieu.doiTac}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] font-medium text-slate-700">{phieu.dvVanChuyen}</div>
                        {phieu.maVanDon && (
                          <div className="font-mono text-[10px] text-slate-400">{phieu.maVanDon}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{phieu.kho}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {dinhDangSo(phieu.soLuong)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-rose-700">
                        {dinhDangTien(phieu.tongTien)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            phieu.trangThai === 'thanh_cong'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : phieu.trangThai === 'dang_van_chuyen'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : phieu.trangThai === 'cho_duyet'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {phieu.trangThai === 'thanh_cong'
                            ? 'Thành công'
                            : phieu.trangThai === 'dang_van_chuyen'
                            ? 'Đang giao'
                            : phieu.trangThai === 'cho_duyet'
                            ? 'Chờ duyệt'
                            : 'Đã trả hàng'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setDetailPhieu(phieu)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                            title="Xem chi tiết & in phiếu"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!isTraHang && (
                            <button
                              onClick={() => {
                                setReturnPhieu(phieu);
                                setReturnReason('');
                              }}
                              className="p-1.5 hover:bg-amber-50 text-slate-500 hover:text-amber-700 rounded-lg transition"
                              title="Khách trả hàng về nơi xuất"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteReceipt(phieu)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                            title="Xóa phiếu (hoàn tác tồn kho)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL LẬP PHIẾU XUẤT MỚI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Lập phiếu xuất kho hàng hóa (Outbound)
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Kiểm soát số lượng xuất và chống xuất âm kho tuyệt đối
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReceipt} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Khách hàng / Đại lý nhận (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={newReceipt.doiTac}
                    onChange={e => setNewReceipt({ ...newReceipt, doiTac: e.target.value })}
                    placeholder="VD: Hệ thống CellphoneS, DigiCity..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Kho xuất hàng (*)
                  </label>
                  <select
                    value={newReceipt.kho}
                    onChange={e => setNewReceipt({ ...newReceipt, kho: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Kho Tổng Hà Nội">Kho Tổng Hà Nội</option>
                    <option value="Kho Chi nhánh Bình Dương">Kho Chi nhánh Bình Dương</option>
                    <option value="Kho Đà Nẵng">Kho Đà Nẵng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Đơn vị vận chuyển
                  </label>
                  <select
                    value={newReceipt.dvVanChuyen}
                    onChange={e => setNewReceipt({ ...newReceipt, dvVanChuyen: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Shopee Xpress (SPX)">Shopee Xpress (SPX)</option>
                    <option value="Giao Hàng Tiết Kiệm (GHTK)">Giao Hàng Tiết Kiệm (GHTK)</option>
                    <option value="Giao Hàng Nhanh (GHN)">Giao Hàng Nhanh (GHN)</option>
                    <option value="Viettel Post">Viettel Post</option>
                    <option value="J&T Express">J&T Express</option>
                    <option value="Khách tự đến kho lấy">Khách tự đến kho lấy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Mã vận đơn
                  </label>
                  <input
                    type="text"
                    value={newReceipt.maVanDon}
                    onChange={e => setNewReceipt({ ...newReceipt, maVanDon: e.target.value })}
                    placeholder="VD: SPXVN03928191"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Danh sách sản phẩm xuất đi (Kiểm tra tồn kho):
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm mặt hàng</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 font-bold">Chọn sản phẩm (Tồn hiện tại)</th>
                        <th className="p-2.5 font-bold text-center w-24">Số lượng</th>
                        <th className="p-2.5 font-bold text-center w-20">Đơn vị</th>
                        <th className="p-2.5 font-bold text-right w-32">Đơn giá bán</th>
                        <th className="p-2.5 font-bold text-right w-36">Thành tiền</th>
                        <th className="p-2.5 text-center w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {newReceipt.items.map((item, idx) => {
                        const selectedProd = sanPhamList.find(
                          p => p.id === item.spId || p.sku === item.sku
                        );
                        const maxStock = selectedProd ? selectedProd.soLuong : 0;
                        const isOverStock = item.soLuong > maxStock;

                        return (
                          <tr key={idx} className={isOverStock ? 'bg-rose-50/50' : ''}>
                            <td className="p-2">
                              <select
                                value={item.spId}
                                onChange={e => handleItemProductChange(idx, e.target.value)}
                                className="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                              >
                                {sanPhamList.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.sku} - {p.ten} (Tồn khả dụng: {p.soLuong})
                                  </option>
                                ))}
                              </select>
                              {isOverStock && (
                                <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Vượt tồn kho! Chỉ còn {maxStock} trong kho.
                                </span>
                              )}
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="1"
                                value={item.soLuong}
                                onChange={e =>
                                  handleItemQtyPriceChange(
                                    idx,
                                    Number(e.target.value),
                                    item.donGia
                                  )
                                }
                                className={`w-full p-1.5 border rounded-lg text-xs text-center font-bold ${
                                  isOverStock
                                    ? 'border-rose-400 bg-rose-50 text-rose-700'
                                    : 'border-slate-200'
                                }`}
                              />
                            </td>
                            <td className="p-2 text-center text-slate-500 font-medium">
                              {item.donVi}
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                step="1000"
                                value={item.donGia}
                                onChange={e =>
                                  handleItemQtyPriceChange(
                                    idx,
                                    item.soLuong,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full p-1.5 border border-slate-200 rounded-lg text-xs text-right font-medium"
                              />
                            </td>
                            <td className="p-2 text-right font-bold text-rose-700">
                              {dinhDangTien(item.thanhTien)}
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItemRow(idx)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                                title="Xóa hàng này"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Grand total bar */}
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-900">
                    Tổng xuất: {calculateReceiptTotals().totalQty} sản phẩm
                  </span>
                  <div className="text-right">
                    <span className="text-rose-700 font-medium">Tổng giá trị đơn xuất: </span>
                    <span className="text-base font-black text-rose-800">
                      {dinhDangTien(calculateReceiptTotals().grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Ghi chú xuất kho
                </label>
                <textarea
                  rows={2}
                  value={newReceipt.ghiChu}
                  onChange={e => setNewReceipt({ ...newReceipt, ghiChu: e.target.value })}
                  placeholder="Ghi chú thêm về đơn hàng, thời gian hẹn giao..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition"
                >
                  Xác nhận xuất & Trừ tồn kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT & IN PHIẾU */}
      {detailPhieu && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto print:shadow-none print:border-none print:m-0 print:p-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                  PHIẾU XUẤT KHO KIÊM BÀN GIAO
                </span>
                <h3 className="text-xl font-black text-slate-900 font-mono">
                  {detailPhieu.maPhieu}
                </h3>
                <p className="text-xs text-slate-500">Thời gian tạo: {detailPhieu.thoiGian}</p>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In phiếu</span>
                </button>
                <button
                  onClick={() => setDetailPhieu(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Khách hàng / Đại lý nhận:
                </span>
                <span className="font-bold text-slate-800 text-sm">{detailPhieu.doiTac}</span>
                <p className="text-slate-500 mt-1">
                  Đơn vị vận chuyển: <b>{detailPhieu.dvVanChuyen}</b>
                </p>
                {detailPhieu.maVanDon && (
                  <p className="font-mono text-[11px] text-slate-500">
                    Mã vận đơn: {detailPhieu.maVanDon}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Kho xuất hàng:
                </span>
                <span className="font-bold text-slate-800">{detailPhieu.kho}</span>
                <p className="text-slate-500 mt-1">Người lập phiếu: {detailPhieu.nguoiLap}</p>
                <p className="text-rose-700 font-bold mt-1">
                  Trạng thái:{' '}
                  {detailPhieu.trangThai === 'thanh_cong'
                    ? 'Thành công'
                    : detailPhieu.trangThai === 'dang_van_chuyen'
                    ? 'Đang vận chuyển'
                    : detailPhieu.trangThai === 'cho_duyet'
                    ? 'Chờ duyệt'
                    : 'Đã hoàn trả'}
                </p>
              </div>
            </div>

            {/* Itemized List */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-3 font-bold">STT</th>
                    <th className="p-3 font-bold">Tên sản phẩm</th>
                    <th className="p-3 font-bold text-center">Số lượng</th>
                    <th className="p-3 font-bold text-right">Đơn giá bán</th>
                    <th className="p-3 font-bold text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(detailPhieu.danhSachHang || []).map((h, i) => (
                    <tr key={i}>
                      <td className="p-3 text-slate-400">{i + 1}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{h.ten}</div>
                        <div className="font-mono text-[10px] text-purple-700">{h.sku}</div>
                      </td>
                      <td className="p-3 text-center font-bold">
                        {h.soLuong} {h.donVi}
                      </td>
                      <td className="p-3 text-right text-slate-600">{dinhDangTien(h.donGia)}</td>
                      <td className="p-3 text-right font-bold text-rose-800">
                        {dinhDangTien(h.thanhTien)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-200 rounded-2xl">
              <div>
                <span className="text-xs text-rose-800 font-semibold block">
                  Tổng số lượng sản phẩm xuất:
                </span>
                <span className="text-sm font-bold text-rose-950">
                  {detailPhieu.soLuong} đơn vị
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-rose-800 font-semibold block">
                  Tổng giá trị đơn hàng:
                </span>
                <span className="text-xl font-black text-rose-800">
                  {dinhDangTien(detailPhieu.tongTien)}
                </span>
              </div>
            </div>

            {detailPhieu.ghiChu && (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                Ghi chú: {detailPhieu.ghiChu}
              </p>
            )}

            {detailPhieu.lyDoTraHang && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-800">Thông tin khách hàng trả lại:</span>
                <p className="text-amber-700">{detailPhieu.lyDoTraHang}</p>
                <p className="text-[11px] text-amber-600">
                  Thời gian: {detailPhieu.thoiGianTraHang} &bull; Người thực hiện:{' '}
                  {detailPhieu.nguoiTraHang}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL KHÁCH TRẢ HÀNG VỀ NƠI XUẤT */}
      {returnPhieu && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-amber-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700">
                <RotateCcw className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Khách trả hàng về nơi xuất</h3>
              </div>
              <button
                onClick={() => setReturnPhieu(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1.5 text-amber-900">
              <p className="font-bold">
                Quy trình Nhập hoàn hàng từ đối tác ({returnPhieu.doiTac}):
              </p>
              <p className="text-amber-700 text-[11px] leading-relaxed">
                Hàng được khách gửi trả lại kho sẽ được <b>cộng hoàn lại vào tồn kho</b> để tiếp tục
                lưu trữ và bán cho đơn hàng khác.
              </p>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Lý do hoàn trả (*)
                </label>
                <textarea
                  rows={3}
                  required
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  placeholder="VD: Khách đổi size/màu sắc khác, hàng còn nguyên seal bưu phẩm..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReturnPhieu(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-200 transition"
                >
                  Ghi nhận nhập hoàn & Tăng tồn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
