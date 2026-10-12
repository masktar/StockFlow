import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockStore, dinhDangSo, dinhDangTien } from '../../services/store';
import { StockExcel } from '../../services/excel';
import { api } from '../../services/api';
import { SanPham } from '../../types';
import {
  Search,
  X,
  FileSpreadsheet,
  Upload,
  Plus,
  Edit2,
  Trash2,
  Info,
  CheckCircle,
  AlertTriangle,
  FileDown,
  RefreshCw
} from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const { sanPhamList, refreshAll, showToast, syncWithDatabase } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('tat-ca');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SanPham | null>(null);

  // Form states for Add Product
  const [formData, setFormData] = useState<Omit<SanPham, 'id'>>({
    sku: '',
    ten: '',
    danhMuc: 'Điện thoại',
    kho: 'Kho Tổng Hà Nội',
    soLuong: 10,
    dinhMucToiThieu: 10,
    giaNhap: 10000000,
    giaXuat: 12000000,
    donVi: 'Chiếc',
    viTri: 'Kệ A1-01'
  });

  // Import preview state
  const [csvPreviewRows, setCsvPreviewRows] = useState<Omit<SanPham, 'id'>[]>([]);
  const [csvFileName, setCsvFileName] = useState('');

  // Filtering
  const filteredProducts = sanPhamList.filter(p => {
    const matchSearch =
      searchTerm === '' ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ten.toLowerCase().includes(searchTerm.toLowerCase());
    const matchWarehouse = selectedWarehouse === 'tat-ca' || p.kho === selectedWarehouse;
    return matchSearch && matchWarehouse;
  });

  // Check if SKU exists
  const isDuplicateSku = (sku: string, currentId?: string) => {
    return sanPhamList.some(
      p => p.sku.toLowerCase() === sku.trim().toLowerCase() && p.id !== currentId
    );
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sku.trim() || !formData.ten.trim()) {
      showToast('Vui lòng nhập đầy đủ mã SKU và tên sản phẩm', 'error');
      return;
    }

    if (isDuplicateSku(formData.sku)) {
      showToast(`Mã SKU "${formData.sku}" đã tồn tại trong hệ thống! Vui lòng chọn mã khác`, 'error');
      return;
    }

    StockStore.themSanPham(formData);
    api.createProduct(formData).catch(e => console.warn('[MySQL Sync] Lỗi tạo sản phẩm:', e));
    refreshAll();
    setIsAddModalOpen(false);
    showToast(`Đã thêm sản phẩm "${formData.ten}" thành công!`, 'success');

    // Reset form
    setFormData({
      sku: '',
      ten: '',
      danhMuc: 'Điện thoại',
      kho: 'Kho Tổng Hà Nội',
      soLuong: 10,
      dinhMucToiThieu: 10,
      giaNhap: 10000000,
      giaXuat: 12000000,
      donVi: 'Chiếc',
      viTri: 'Kệ A1-01'
    });
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isDuplicateSku(editingProduct.sku, editingProduct.id)) {
      showToast(`Mã SKU "${editingProduct.sku}" đã được sử dụng bởi sản phẩm khác!`, 'error');
      return;
    }

    StockStore.capNhatSanPham(editingProduct.id, editingProduct);
    api.updateProduct(editingProduct.id, editingProduct).catch(e => console.warn('[MySQL Sync] Lỗi cập nhật sản phẩm:', e));
    refreshAll();
    setIsEditModalOpen(false);
    setEditingProduct(null);
    showToast(`Đã cập nhật sản phẩm "${editingProduct.ten}" thành công!`, 'success');
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}" khỏi kho?`)) {
      StockStore.xoaSanPham(id);
      api.deleteProduct(id).catch(e => console.warn('[MySQL Sync] Lỗi xóa sản phẩm:', e));
      refreshAll();
      showToast(`Đã xóa sản phẩm "${name}"!`, 'info');
    }
  };

  // CSV parsing & import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result as string;
      if (!text) return;

      const rawRows = StockExcel.docFileCSV(text);
      if (rawRows.length < 2) {
        showToast('File CSV không hợp lệ hoặc không có dữ liệu!', 'error');
        return;
      }

      // Skip header row
      const dataRows = rawRows.slice(1);
      const parsedItems: Omit<SanPham, 'id'>[] = [];

      for (const row of dataRows) {
        if (!row[0] || !row[1]) continue;
        parsedItems.push({
          sku: row[0] || 'SKU-NEW',
          ten: row[1] || 'Sản phẩm mới',
          danhMuc: row[2] || 'Khác',
          kho: row[3] || 'Kho Tổng Hà Nội',
          soLuong: Number(row[4]) || 0,
          dinhMucToiThieu: Number(row[5]) || 5,
          giaNhap: Number(row[6]) || 0,
          giaXuat: Number(row[7]) || 0,
          donVi: row[8] || 'Chiếc',
          viTri: row[9] || 'Kệ A'
        });
      }

      setCsvPreviewRows(parsedItems);
      showToast(`Đã đọc ${parsedItems.length} sản phẩm từ file CSV. Hãy xem trước và bấm Lưu`, 'info');
    };
    reader.readAsText(file);
  };

  const handleCommitImport = () => {
    if (csvPreviewRows.length === 0) {
      showToast('Chưa có dữ liệu để nhập!', 'error');
      return;
    }

    let countAdded = 0;
    csvPreviewRows.forEach(item => {
      // If SKU doesn't exist, add
      if (!isDuplicateSku(item.sku)) {
        StockStore.themSanPham(item);
        countAdded++;
      }
    });

    refreshAll();
    setIsImportModalOpen(false);
    setCsvPreviewRows([]);
    setCsvFileName('');
    showToast(`Đã nhập thành công ${countAdded} sản phẩm mới vào hệ thống!`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Guidance Info Card */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 text-sm block mb-0.5">
              Quy trình quản lý hàng hóa & Cập nhật giá bán:
            </span>
            <p className="text-slate-600 leading-relaxed">
              Trước khi thêm mới, hãy <b>gõ tìm kiếm</b> xem sản phẩm đã có trong kho chưa. Nếu sản phẩm đã có (ví dụ <i>iPhone 16 giảm giá từ 30tr xuống 25tr</i>), chỉ cần bấm nút <b>Sửa</b> để điều chỉnh giá bán ngay mà không cần tạo lại.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-white border border-purple-200 text-purple-700 font-bold text-xs shadow-2xs">
            Hiển thị {filteredProducts.length} / {sanPhamList.length} mặt hàng
          </span>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Nhập tên sản phẩm hoặc mã SKU để tra cứu..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 font-bold p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Warehouse Filter */}
          <select
            value={selectedWarehouse}
            onChange={e => setSelectedWarehouse(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white shadow-2xs"
          >
            <option value="tat-ca">Tất cả chi nhánh kho</option>
            <option value="Kho Tổng Hà Nội">Kho Tổng Hà Nội</option>
            <option value="Kho Chi nhánh Bình Dương">Kho Chi nhánh Bình Dương</option>
            <option value="Kho Đà Nẵng">Kho Đà Nẵng</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={async () => {
              setIsSyncing(true);
              await syncWithDatabase();
              setTimeout(() => setIsSyncing(false), 500);
            }}
            disabled={isSyncing}
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            title="Đồng bộ nạp lại danh sách sản phẩm mới nhất từ cơ sở dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Đồng bộ CSDL</span>
          </button>

          <button
            onClick={() => StockExcel.xuatBaoCaoHangHoa(selectedWarehouse)}
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
            title="Xuất báo cáo kiểm kê tồn kho & giá trị tháng ra file Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Báo Cáo Tháng</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
            title="Nhập danh mục hàng hóa số lượng lớn từ file Excel/CSV"
          >
            <Upload className="w-4 h-4" />
            <span>Nhập Excel</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-200 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Mã SKU</th>
                <th className="py-3.5 px-4 font-bold">Tên sản phẩm</th>
                <th className="py-3.5 px-4 font-bold">Danh mục</th>
                <th className="py-3.5 px-4 font-bold">Kho lưu trữ</th>
                <th className="py-3.5 px-4 font-bold text-center">Tồn kho / Định mức</th>
                <th className="py-3.5 px-4 font-bold text-right">Giá nhập vốn</th>
                <th className="py-3.5 px-4 font-bold text-right">Giá bán đề xuất</th>
                <th className="py-3.5 px-4 font-bold text-center">Vị trí kệ</th>
                <th className="py-3.5 px-4 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Không tìm thấy sản phẩm nào khớp với tìm kiếm hoặc bộ lọc!
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => {
                  const hetHang = prod.soLuong === 0;
                  const sapHet = prod.soLuong <= prod.dinhMucToiThieu;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-900">{prod.sku}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{prod.ten}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {prod.danhMuc}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{prod.kho}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className={`font-black ${
                              hetHang
                                ? 'text-rose-600'
                                : sapHet
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {prod.soLuong}
                          </span>
                          <span className="text-slate-400">/ {prod.dinhMucToiThieu} {prod.donVi}</span>
                        </div>
                        {hetHang ? (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            Hết hàng
                          </span>
                        ) : sapHet ? (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Dưới an toàn
                          </span>
                        ) : (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Đạt chuẩn
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                        {dinhDangTien(prod.giaNhap)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-purple-700">
                        {dinhDangTien(prod.giaXuat)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px]">
                          {prod.viTri || 'Chưa xếp'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct({ ...prod });
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-purple-50 text-slate-500 hover:text-purple-700 rounded-lg transition"
                            title="Sửa thông tin & giá bán"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.ten)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                            title="Xóa sản phẩm"
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

      {/* MODAL THÊM SẢN PHẨM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Thêm sản phẩm mới vào kho</h3>
                <p className="text-slate-400 text-[11px]">
                  Đăng ký mã SKU và định mức tồn kho ban đầu
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Mã SKU (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="VD: SKU-IP16-128"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Danh mục
                  </label>
                  <select
                    value={formData.danhMuc}
                    onChange={e => setFormData({ ...formData, danhMuc: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Điện thoại">Điện thoại</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                    <option value="Âm thanh">Âm thanh</option>
                    <option value="Màn hình">Màn hình</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tên sản phẩm (*)
                </label>
                <input
                  type="text"
                  required
                  value={formData.ten}
                  onChange={e => setFormData({ ...formData, ten: e.target.value })}
                  placeholder="VD: iPhone 16 Pro Max 256GB Desert Titanium"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Kho lưu trữ
                  </label>
                  <select
                    value={formData.kho}
                    onChange={e => setFormData({ ...formData, kho: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Kho Tổng Hà Nội">Kho Tổng Hà Nội</option>
                    <option value="Kho Chi nhánh Bình Dương">Kho Chi nhánh Bình Dương</option>
                    <option value="Kho Đà Nẵng">Kho Đà Nẵng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Vị trí kệ kho
                  </label>
                  <input
                    type="text"
                    value={formData.viTri}
                    onChange={e => setFormData({ ...formData, viTri: e.target.value })}
                    placeholder="VD: Kệ A1-02"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Số lượng tồn
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.soLuong}
                    onChange={e => setFormData({ ...formData, soLuong: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Định mức an toàn
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.dinhMucToiThieu}
                    onChange={e =>
                      setFormData({ ...formData, dinhMucToiThieu: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Đơn vị tính
                  </label>
                  <input
                    type="text"
                    value={formData.donVi}
                    onChange={e => setFormData({ ...formData, donVi: e.target.value })}
                    placeholder="Chiếc, Hộp..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Giá nhập vốn (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.giaNhap}
                    onChange={e => setFormData({ ...formData, giaNhap: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Giá bán đề xuất (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.giaXuat}
                    onChange={e => setFormData({ ...formData, giaXuat: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
                >
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA SẢN PHẨM & GIÁ BÁN */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Cập nhật thông tin & Giá bán
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Điều chỉnh giá niêm yết, số lượng tồn và vị trí kệ
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Mã SKU (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-600 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Danh mục
                  </label>
                  <select
                    value={editingProduct.danhMuc}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, danhMuc: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Điện thoại">Điện thoại</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                    <option value="Âm thanh">Âm thanh</option>
                    <option value="Màn hình">Màn hình</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tên sản phẩm (*)
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.ten}
                  onChange={e => setEditingProduct({ ...editingProduct, ten: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Kho lưu trữ
                  </label>
                  <select
                    value={editingProduct.kho}
                    onChange={e => setEditingProduct({ ...editingProduct, kho: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Kho Tổng Hà Nội">Kho Tổng Hà Nội</option>
                    <option value="Kho Chi nhánh Bình Dương">Kho Chi nhánh Bình Dương</option>
                    <option value="Kho Đà Nẵng">Kho Đà Nẵng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Vị trí kệ kho
                  </label>
                  <input
                    type="text"
                    value={editingProduct.viTri}
                    onChange={e => setEditingProduct({ ...editingProduct, viTri: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Số lượng tồn
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.soLuong}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, soLuong: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Định mức an toàn
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.dinhMucToiThieu}
                    onChange={e =>
                      setEditingProduct({
                        ...editingProduct,
                        dinhMucToiThieu: Number(e.target.value)
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Đơn vị tính
                  </label>
                  <input
                    type="text"
                    value={editingProduct.donVi}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, donVi: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Giá nhập vốn (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={editingProduct.giaNhap}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, giaNhap: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-purple-900 uppercase mb-1">
                    Giá bán đề xuất (VNĐ) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={editingProduct.giaXuat}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, giaXuat: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-purple-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-600 font-black text-purple-700"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NHẬP FILE EXCEL / CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Nhập danh mục sản phẩm từ file Excel (CSV)
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Tải file mẫu, điền dữ liệu và tải lên để thêm số lượng lớn
                </p>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setCsvPreviewRows([]);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template download banner */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-blue-900">
                <Info className="w-4 h-4 shrink-0 text-blue-600" />
                <span>Chưa có file mẫu chuẩn? Tải về file mẫu để điền dữ liệu đúng định dạng:</span>
              </div>
              <button
                onClick={() => StockExcel.taiFileMauHangHoa()}
                className="px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-xl font-bold text-xs hover:bg-blue-100 transition shrink-0 flex items-center gap-1.5 shadow-2xs"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Tải file mẫu CSV</span>
              </button>
            </div>

            {/* File picker */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-purple-500 transition cursor-pointer bg-slate-50/50">
              <input
                type="file"
                accept=".csv"
                id="file-csv-input"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-csv-input" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-purple-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">
                  {csvFileName ? `Đã chọn: ${csvFileName}` : 'Nhấn vào đây để chọn file CSV từ máy tính'}
                </p>
                <p className="text-[11px] text-slate-400">Hỗ trợ file .csv mã hóa UTF-8 BOM chuẩn tiếng Việt</p>
              </label>
            </div>

            {/* Preview table */}
            {csvPreviewRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Xem trước dữ liệu ({csvPreviewRows.length} sản phẩm):
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Sẵn sàng lưu
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 sticky top-0">
                      <tr>
                        <th className="p-2 font-bold">Mã SKU</th>
                        <th className="p-2 font-bold">Tên sản phẩm</th>
                        <th className="p-2 font-bold">Kho</th>
                        <th className="p-2 font-bold text-center">Tồn ban đầu</th>
                        <th className="p-2 font-bold text-right">Giá vốn</th>
                        <th className="p-2 font-bold text-right">Giá bán</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {csvPreviewRows.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2 font-mono font-bold text-purple-900">{r.sku}</td>
                          <td className="p-2 font-medium text-slate-800">{r.ten}</td>
                          <td className="p-2 text-slate-600">{r.kho}</td>
                          <td className="p-2 text-center font-bold">{r.soLuong}</td>
                          <td className="p-2 text-right">{dinhDangTien(r.giaNhap)}</td>
                          <td className="p-2 text-right">{dinhDangTien(r.giaXuat)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setCsvPreviewRows([]);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={csvPreviewRows.length === 0}
                onClick={handleCommitImport}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
              >
                Lưu vào hệ thống ({csvPreviewRows.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
