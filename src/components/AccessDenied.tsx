import React from 'react';
import { useApp } from '../context/AppContext';
import { PHAN_QUYEN_HE_THONG } from '../services/store';
import { TabKey } from '../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AccessDenied: React.FC = () => {
  const { currentUser, setActiveTab } = useApp();
  const roleInfo = PHAN_QUYEN_HE_THONG[currentUser.vaiTro] || PHAN_QUYEN_HE_THONG.staff;

  const tabNames: Record<TabKey, string> = {
    'tong-quan': '1. Tổng quan kho',
    'hang-hoa': '2. Hàng hóa & Tồn kho',
    'nhap-kho': '3. Phiếu nhập',
    'xuat-kho': '3. Phiếu xuất',
    'nha-cung-cap': '4. Nhà cung cấp & Đối tác',
    'nhan-su': '5. Nhân sự & Phân quyền',
    'nhat-ky': '6. Nhật ký kiểm toán'
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xl mx-auto shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div>
        <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200">
          Lỗi 403 - Quyền truy cập bị từ chối
        </span>
        <h2 className="text-xl font-bold text-slate-900">Bạn không có quyền xem trang này!</h2>
        <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          Tài khoản hiện tại của bạn là <b>{currentUser.ten}</b> với vai trò{' '}
          <span className="font-bold text-rose-700">{roleInfo.ten}</span>. Theo ma trận phân quyền
          (RBAC), vai trò của bạn bị giới hạn và không được phép truy cập vào chức năng này.
        </p>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
        <p className="font-bold text-slate-800">Các trang bạn ĐƯỢC PHÉP truy cập với vai trò hiện tại:</p>
        <div className="flex flex-wrap gap-2">
          {roleInfo.trangDuocPhep.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-purple-400 text-purple-700 rounded-xl font-semibold transition text-xs shadow-2xs"
            >
              {tabNames[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-center">
        <button
          onClick={() => setActiveTab('tong-quan')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang Tổng quan</span>
        </button>
      </div>
    </div>
  );
};
