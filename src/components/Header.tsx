import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PHAN_QUYEN_HE_THONG } from '../services/store';
import { TabKey, UserRole } from '../types';
import { ShieldCheck, User as UserIcon, LogOut, Database, RefreshCw, Settings2 } from 'lucide-react';
import { DatabaseSyncModal } from './DatabaseSyncModal';

export const Header: React.FC = () => {
  const { currentUser, activeTab, logout, syncWithDatabase, dbStatus } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const roleInfo = PHAN_QUYEN_HE_THONG[currentUser.vaiTro] || PHAN_QUYEN_HE_THONG.staff;

  const handleSync = async () => {
    setIsSyncing(true);
    await syncWithDatabase();
    setTimeout(() => setIsSyncing(false), 500);
  };

  const isMySqlLive = dbStatus?.connectedToMySql;

  const tieuDeTrangMap: Record<TabKey, { tieuDe: string; moTa: string }> = {
    'tong-quan': {
      tieuDe: '1. Tổng quan & Báo cáo điều hành',
      moTa: 'Thống kê lượng hàng, tồn kho, cảnh báo định mức thời gian thực'
    },
    'hang-hoa': {
      tieuDe: '2. Quản lý Danh mục Hàng hóa & Tồn kho',
      moTa: 'Tra cứu SKU, số lượng tồn, giá vốn, vị trí kệ hàng'
    },
    'nhap-kho': {
      tieuDe: '3. Phiếu hàng > Phiếu nhập',
      moTa: 'Lập phiếu nhập kho, theo dõi tiến độ và cập nhật tồn kho'
    },
    'xuat-kho': {
      tieuDe: '3. Phiếu hàng > Phiếu xuất',
      moTa: 'Lập phiếu xuất kho, theo dõi tiến độ và kiểm soát chống xuất âm'
    },
    'nha-cung-cap': {
      tieuDe: '4. Quản lý Nhà cung cấp & Đối tác',
      moTa: 'Thông tin liên hệ, công nợ và nhà phân phối chiến lược'
    },
    'nhan-su': {
      tieuDe: '5. Phân quyền & Quản lý Nhân sự',
      moTa: 'Phân quyền tài khoản theo vai trò (Admin, Quản lý, Thủ kho, Kế toán)'
    },
    'nhat-ky': {
      tieuDe: '6. Nhật ký kiểm toán & Lịch sử thao tác',
      moTa: 'Ghi vết hành động (Audit Trail) phục vụ đối soát và nộp bài tập'
    }
  };

  const info = tieuDeTrangMap[activeTab] || {
    tieuDe: 'Hệ thống Kho Vận',
    moTa: 'StockFlow - Quản lý kho hàng chuyên nghiệp'
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 gap-3 shrink-0">
      <div>
        <h2 className="text-base font-bold text-slate-900 leading-tight">{info.tieuDe}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{info.moTa}</p>
      </div>

      <div className="flex items-center gap-2.5 self-end sm:self-center">
        <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              isMySqlLive
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
            title="Bấm để đồng bộ dữ liệu mới nhất từ CSDL / MySQL"
          >
            <Database className={`w-3.5 h-3.5 ${isMySqlLive ? 'text-emerald-600' : 'text-blue-600'}`} />
            <span>{isMySqlLive ? 'MySQL (Live)' : 'CSDL qlykho'}</span>
            <RefreshCw className={`w-3.5 h-3.5 ml-0.5 ${isMySqlLive ? 'text-emerald-600' : 'text-blue-600'} ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-l border-slate-200 transition cursor-pointer"
            title="Mở cấu hình kết nối & trung tâm đồng bộ MySQL"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <DatabaseSyncModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200/80 rounded-xl text-xs shadow-2xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="text-slate-500 hidden sm:inline">Quyền:</span>
          <span className="font-bold text-purple-950">{roleInfo.ten}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <UserIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>{currentUser.ten || 'Khách'}</span>
        </div>

        <button
          onClick={logout}
          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-200 transition shadow-2xs"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
