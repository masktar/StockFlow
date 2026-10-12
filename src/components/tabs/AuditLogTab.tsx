import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockStore } from '../../services/store';
import { StockExcel } from '../../services/excel';
import { Search, X, FileSpreadsheet, Printer, Trash2, ShieldAlert } from 'lucide-react';

export const AuditLogTab: React.FC = () => {
  const { nhatKyList, refreshAll, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = nhatKyList.filter(l => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      l.hanhDong.toLowerCase().includes(q) ||
      l.nguoiThaoTac.toLowerCase().includes(q) ||
      l.doiTuong.toLowerCase().includes(q) ||
      l.chiTiet.toLowerCase().includes(q) ||
      l.vaiTro.toLowerCase().includes(q)
    );
  });

  const handleClearLogs = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử nhật ký kiểm toán?')) {
      StockStore.xoaTatCaNhatKy();
      refreshAll();
      showToast('Đã xóa toàn bộ nhật ký hệ thống!', 'info');
    }
  };

  const getActionBadge = (hanhDong: string) => {
    const hd = hanhDong.toUpperCase();
    if (hd.includes('NHẬP')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (hd.includes('XUẤT')) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    if (hd.includes('TRẢ HÀNG')) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    if (hd.includes('ĐĂNG NHẬP')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (hd.includes('XÓA')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-purple-100 text-purple-800 border-purple-200';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo hành động, người thao tác, đối tượng hoặc nội dung..."
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

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => StockExcel.xuatBaoCaoNhatKy()}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất file Excel (CSV)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>In báo cáo</span>
          </button>

          <button
            onClick={handleClearLogs}
            className="px-3 py-2 border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa nhật ký</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Thời gian</th>
                <th className="py-3.5 px-4 font-bold">Người thực hiện</th>
                <th className="py-3.5 px-4 font-bold">Vai trò</th>
                <th className="py-3.5 px-4 font-bold">Hành động</th>
                <th className="py-3.5 px-4 font-bold">Mục tiêu / Đối tượng</th>
                <th className="py-3.5 px-4 font-bold">Nội dung chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không tìm thấy bản ghi nhật ký kiểm toán nào!
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {log.thoiGian}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.nguoiThaoTac}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {log.vaiTro}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadge(
                          log.hanhDong
                        )}`}
                      >
                        {log.hanhDong}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-900">
                      {log.doiTuong}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 leading-relaxed">{log.chiTiet}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
