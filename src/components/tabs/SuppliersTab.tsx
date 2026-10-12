import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockStore, dinhDangTien } from '../../services/store';
import { StockExcel } from '../../services/excel';
import { api } from '../../services/api';
import { NhaCungCap } from '../../types';
import {
  Search,
  X,
  FileSpreadsheet,
  Upload,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileDown,
  CheckCircle
} from 'lucide-react';

export const SuppliersTab: React.FC = () => {
  const { nccList, refreshAll, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNcc, setEditingNcc] = useState<NhaCungCap | null>(null);
  const [debtModalNcc, setDebtModalNcc] = useState<NhaCungCap | null>(null);
  const [debtAmount, setDebtAmount] = useState<number>(10000000);
  const [debtActionType, setDebtActionType] = useState<'pay' | 'increase'>('pay');
  const [debtNote, setDebtNote] = useState('');

  // CSV Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvPreviewRows, setCsvPreviewRows] = useState<Omit<NhaCungCap, 'id'>[]>([]);
  const [csvFileName, setCsvFileName] = useState('');

  // Form State
  const [formData, setFormData] = useState<Omit<NhaCungCap, 'id'>>({
    ma: '',
    ten: '',
    nguoiLienHe: '',
    dienThoai: '',
    email: '',
    diaChi: '',
    congNo: 0,
    trangThai: 'active'
  });

  // Filter
  const filteredSuppliers = nccList.filter(s => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      s.ma.toLowerCase().includes(q) ||
      s.ten.toLowerCase().includes(q) ||
      s.nguoiLienHe.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.dienThoai.includes(q)
    );
  });

  const tongCongNo = nccList.reduce((acc, s) => acc + (s.congNo || 0), 0);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ma.trim() || !formData.ten.trim()) {
      showToast('Vui lòng nhập đầy đủ mã và tên nhà cung cấp!', 'error');
      return;
    }

    if (nccList.some(s => s.ma.toLowerCase() === formData.ma.trim().toLowerCase())) {
      showToast(`Mã đối tác "${formData.ma}" đã tồn tại!`, 'error');
      return;
    }

    StockStore.themNhaCungCap(formData);
    api.createSupplier(formData).catch(e => console.warn('[MySQL Sync] Lỗi tạo NCC:', e));
    refreshAll();
    setIsAddModalOpen(false);
    showToast(`Đã thêm nhà cung cấp "${formData.ten}" thành công!`, 'success');

    setFormData({
      ma: '',
      ten: '',
      nguoiLienHe: '',
      dienThoai: '',
      email: '',
      diaChi: '',
      congNo: 0,
      trangThai: 'active'
    });
  };

  const handleSaveEditSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNcc) return;

    StockStore.capNhatNhaCungCap(editingNcc.id, editingNcc);
    refreshAll();
    setEditingNcc(null);
    showToast(`Đã cập nhật thông tin nhà cung cấp "${editingNcc.ten}"!`, 'success');
  };

  const handleDeleteSupplier = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa nhà cung cấp "${name}"?`)) {
      StockStore.xoaNhaCungCap(id);
      refreshAll();
      showToast(`Đã xóa nhà cung cấp "${name}"!`, 'info');
    }
  };

  const handleAdjustDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtModalNcc) return;

    const currentDebt = debtModalNcc.congNo || 0;
    let newDebt = currentDebt;

    if (debtActionType === 'pay') {
      newDebt = Math.max(0, currentDebt - debtAmount);
      StockStore.ghiNhatKy(
        'THANH TOÁN CÔNG NỢ',
        debtModalNcc.ma,
        `Thanh toán trả ${dinhDangTien(debtAmount)} cho NCC ${debtModalNcc.ten}. Nợ cũ: ${dinhDangTien(currentDebt)}, nợ mới: ${dinhDangTien(newDebt)}. Lý do: ${debtNote || 'Thanh toán đợt hàng'}`
      );
    } else {
      newDebt = currentDebt + debtAmount;
      StockStore.ghiNhatKy(
        'GHI TĂNG CÔNG NỢ',
        debtModalNcc.ma,
        `Tăng thêm ${dinhDangTien(debtAmount)} công nợ NCC ${debtModalNcc.ten}. Nợ mới: ${dinhDangTien(newDebt)}. Lý do: ${debtNote || 'Nhập thêm lô hàng nợ'}`
      );
    }

    StockStore.capNhatNhaCungCap(debtModalNcc.id, { congNo: newDebt });
    refreshAll();
    setDebtModalNcc(null);
    setDebtNote('');
    showToast(`Đã cập nhật công nợ cho "${debtModalNcc.ten}" thành công!`, 'success');
  };

  // CSV Import
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

      const dataRows = rawRows.slice(1);
      const parsedItems: Omit<NhaCungCap, 'id'>[] = [];

      for (const row of dataRows) {
        if (!row[0] || !row[1]) continue;
        parsedItems.push({
          ma: row[0],
          ten: row[1],
          nguoiLienHe: row[2] || 'Đại diện kinh doanh',
          dienThoai: row[3] || '',
          email: row[4] || '',
          diaChi: row[5] || '',
          congNo: Number(row[6]) || 0,
          trangThai: 'active'
        });
      }

      setCsvPreviewRows(parsedItems);
      showToast(`Đã đọc ${parsedItems.length} nhà cung cấp từ file CSV`, 'info');
    };
    reader.readAsText(file);
  };

  const handleCommitImport = () => {
    let countAdded = 0;
    csvPreviewRows.forEach(item => {
      if (!nccList.some(n => n.ma.toLowerCase() === item.ma.toLowerCase())) {
        StockStore.themNhaCungCap(item);
        countAdded++;
      }
    });

    refreshAll();
    setIsImportModalOpen(false);
    setCsvPreviewRows([]);
    setCsvFileName('');
    showToast(`Đã thêm ${countAdded} nhà cung cấp mới từ file Excel!`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Tổng số đối tác / NCC</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{nccList.length}</p>
          <span className="text-[10px] text-purple-700 font-semibold">Nhà phân phối chính thức</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs sm:col-span-2">
          <span className="text-xs font-semibold text-slate-500 block">
            Tổng công nợ phải trả đối tác
          </span>
          <p className="text-2xl font-black text-rose-600 mt-1">{dinhDangTien(tongCongNo)}</p>
          <span className="text-[10px] text-slate-500 font-semibold">
            Theo dõi đối soát thanh toán định kỳ hàng tháng
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên nhà cung cấp, mã đối tác, người liên hệ..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
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

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => StockExcel.xuatBaoCaoNCC()}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Báo Cáo Tháng</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Upload className="w-4 h-4" />
            <span>Nhập Excel</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-200 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Nhà cung cấp</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Mã NCC</th>
                <th className="py-3.5 px-4 font-bold">Tên công ty / Đối tác</th>
                <th className="py-3.5 px-4 font-bold">Người đại diện</th>
                <th className="py-3.5 px-4 font-bold">Số điện thoại</th>
                <th className="py-3.5 px-4 font-bold">Email</th>
                <th className="py-3.5 px-4 font-bold">Địa chỉ</th>
                <th className="py-3.5 px-4 font-bold text-right">Công nợ hiện tại</th>
                <th className="py-3.5 px-4 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không tìm thấy nhà cung cấp nào phù hợp với từ khóa!
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-900">{s.ma}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{s.ten}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{s.nguoiLienHe}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{s.dienThoai}</td>
                    <td className="py-3.5 px-4 text-slate-600">{s.email}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{s.diaChi}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-black ${
                          s.congNo > 0 ? 'text-rose-600' : 'text-slate-400'
                        }`}
                      >
                        {dinhDangTien(s.congNo)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setDebtModalNcc(s);
                            setDebtAmount(10000000);
                            setDebtActionType('pay');
                            setDebtNote('');
                          }}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold transition shadow-2xs"
                          title="Đối soát & điều chỉnh công nợ"
                        >
                          Công nợ
                        </button>

                        <button
                          onClick={() => setEditingNcc({ ...s })}
                          className="p-1.5 hover:bg-purple-50 text-slate-500 hover:text-purple-700 rounded-lg transition"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteSupplier(s.id, s.ten)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          title="Xóa nhà cung cấp"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM NCC */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Thêm Nhà cung cấp mới</h3>
                <p className="text-slate-400 text-[11px]">Đăng ký đối tác cung ứng và công nợ ban đầu</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Mã đối tác (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ma}
                    onChange={e => setFormData({ ...formData, ma: e.target.value.toUpperCase() })}
                    placeholder="VD: NCC-ASUS-05"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Người đại diện
                  </label>
                  <input
                    type="text"
                    value={formData.nguoiLienHe}
                    onChange={e => setFormData({ ...formData, nguoiLienHe: e.target.value })}
                    placeholder="VD: Nguyễn Văn B"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tên công ty / Doanh nghiệp (*)
                </label>
                <input
                  type="text"
                  required
                  value={formData.ten}
                  onChange={e => setFormData({ ...formData, ten: e.target.value })}
                  placeholder="VD: ASUS Computer Vietnam LLC"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.dienThoai}
                    onChange={e => setFormData({ ...formData, dienThoai: e.target.value })}
                    placeholder="028 3822 9999"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@asus.vn"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Địa chỉ trụ sở / Kho
                </label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={e => setFormData({ ...formData, diaChi: e.target.value })}
                  placeholder="Tầng 12, Tòa nhà ABC, Q.1, TP.HCM"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Công nợ ban đầu (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={formData.congNo}
                  onChange={e => setFormData({ ...formData, congNo: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 font-bold"
                />
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
                  Lưu đối tác
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA NCC */}
      {editingNcc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Cập nhật Nhà cung cấp</h3>
                <p className="text-slate-400 text-[11px]">{editingNcc.ten}</p>
              </div>
              <button
                onClick={() => setEditingNcc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSupplier} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tên công ty (*)
                </label>
                <input
                  type="text"
                  required
                  value={editingNcc.ten}
                  onChange={e => setEditingNcc({ ...editingNcc, ten: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Người đại diện
                  </label>
                  <input
                    type="text"
                    value={editingNcc.nguoiLienHe}
                    onChange={e => setEditingNcc({ ...editingNcc, nguoiLienHe: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editingNcc.dienThoai}
                    onChange={e => setEditingNcc({ ...editingNcc, dienThoai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingNcc.email}
                  onChange={e => setEditingNcc({ ...editingNcc, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={editingNcc.diaChi}
                  onChange={e => setEditingNcc({ ...editingNcc, diaChi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingNcc(null)}
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

      {/* MODAL CÔNG NỢ */}
      {debtModalNcc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Cập nhật công nợ đối tác</h3>
                <p className="text-slate-400 text-[11px]">{debtModalNcc.ten}</p>
              </div>
              <button
                onClick={() => setDebtModalNcc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Nợ hiện tại:</span>
              <span className="font-black text-rose-600 text-sm">
                {dinhDangTien(debtModalNcc.congNo)}
              </span>
            </div>

            <form onSubmit={handleAdjustDebt} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Hình thức điều chỉnh
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDebtActionType('pay')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      debtActionType === 'pay'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Thanh toán trả nợ
                  </button>
                  <button
                    type="button"
                    onClick={() => setDebtActionType('increase')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      debtActionType === 'increase'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Ghi tăng công nợ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Số tiền thay đổi (VNĐ)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="100000"
                  required
                  value={debtAmount}
                  onChange={e => setDebtAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-black text-purple-900 focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nội dung / Lý do đối soát
                </label>
                <input
                  type="text"
                  value={debtNote}
                  onChange={e => setDebtNote(e.target.value)}
                  placeholder="VD: Ủy nhiệm chi số 9928 qua Vietcombank..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDebtModalNcc(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
                >
                  Xác nhận lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NHẬP NCC EXCEL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Nhập danh bạ NCC từ file Excel (CSV)
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
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <span className="text-blue-900">Tải file mẫu CSV danh bạ nhà cung cấp chuẩn:</span>
              <button
                onClick={() => StockExcel.taiFileMauNCC()}
                className="px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-xl font-bold text-xs hover:bg-blue-100 transition shrink-0 flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Tải file mẫu</span>
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-purple-500 transition cursor-pointer bg-slate-50/50">
              <input
                type="file"
                accept=".csv"
                id="file-ncc-csv-input"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-ncc-csv-input" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-purple-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">
                  {csvFileName ? `Đã chọn: ${csvFileName}` : 'Nhấn vào đây để chọn file CSV từ máy tính'}
                </p>
                <p className="text-[11px] text-slate-400">File CSV mã hóa UTF-8 BOM</p>
              </label>
            </div>

            {csvPreviewRows.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Xem trước dữ liệu ({csvPreviewRows.length} đối tác):
                </span>
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 sticky top-0">
                      <tr>
                        <th className="p-2 font-bold">Mã</th>
                        <th className="p-2 font-bold">Tên công ty</th>
                        <th className="p-2 font-bold">Người liên hệ</th>
                        <th className="p-2 font-bold text-right">Công nợ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {csvPreviewRows.map((r, i) => (
                        <tr key={i}>
                          <td className="p-2 font-mono font-bold text-purple-900">{r.ma}</td>
                          <td className="p-2 font-semibold text-slate-800">{r.ten}</td>
                          <td className="p-2 text-slate-600">{r.nguoiLienHe}</td>
                          <td className="p-2 text-right">{dinhDangTien(r.congNo)}</td>
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
                Lưu danh sách ({csvPreviewRows.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
