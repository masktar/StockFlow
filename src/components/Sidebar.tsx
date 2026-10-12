import React from 'react';
import { useApp } from '../context/AppContext';
import { PHAN_QUYEN_HE_THONG } from '../services/store';
import { TabKey } from '../types';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Boxes,
  FileSpreadsheet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Building2,
  Users2,
  ScrollText,
  RotateCcw,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    resetToDefault,
    logout
  } = useApp();

  const roleInfo = PHAN_QUYEN_HE_THONG[currentUser.vaiTro] || PHAN_QUYEN_HE_THONG.staff;
  const trangDuocPhep = roleInfo.trangDuocPhep;

  const isPhieuActive = activeTab === 'nhap-kho' || activeTab === 'xuat-kho';

  const menuItems: Array<
    | {
        type: 'item';
        id: TabKey;
        name: string;
        icon: React.ReactNode;
        requiredRoleDesc?: string;
      }
    | {
        type: 'group';
        id: 'phieu-hang';
        name: 'Phiếu hàng';
        icon: React.ReactNode;
        subItems: Array<{
          id: TabKey;
          name: string;
          subColor: 'emerald' | 'rose';
          icon: React.ReactNode;
        }>;
      }
  > = [
    {
      type: 'item',
      id: 'tong-quan',
      name: 'Tổng quan kho',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      type: 'item',
      id: 'hang-hoa',
      name: 'Hàng hóa & Tồn kho',
      icon: <Boxes className="w-4 h-4" />
    },
    {
      type: 'group',
      id: 'phieu-hang',
      name: 'Phiếu hàng',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      subItems: [
        {
          id: 'nhap-kho',
          name: 'phiếu nhập',
          subColor: 'emerald',
          icon: <ArrowDownToLine className="w-3.5 h-3.5" />
        },
        {
          id: 'xuat-kho',
          name: 'phiếu xuất',
          subColor: 'rose',
          icon: <ArrowUpFromLine className="w-3.5 h-3.5" />
        }
      ]
    },
    {
      type: 'item',
      id: 'nha-cung-cap',
      name: 'Nhà cung cấp & Đối tác',
      icon: <Building2 className="w-4 h-4" />,
      requiredRoleDesc: 'Chỉ Admin/Kế toán/Quản lý'
    },
    {
      type: 'item',
      id: 'nhan-su',
      name: 'Nhân sự & Phân quyền',
      icon: <Users2 className="w-4 h-4" />,
      requiredRoleDesc: 'Chỉ Quản trị viên (Admin)'
    },
    {
      type: 'item',
      id: 'nhat-ky',
      name: 'Nhật ký kiểm toán',
      icon: <ScrollText className="w-4 h-4" />,
      requiredRoleDesc: 'Chỉ Admin & Quản lý'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm border border-slate-800 shrink-0">
            <Logo size={24} color="#ffffff" strokeWidth={8} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">STOCKFLOW</h1>
            <p className="text-[10px] text-purple-700 font-semibold tracking-wider uppercase">
              KHO HÀNG ĐA CHI NHÁNH
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="p-3 flex-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
          DANH MỤC TRANG WEB
        </p>

        <nav className="space-y-1">
          {menuItems.map(item => {
            if (item.type === 'group') {
              const accessibleSubItems = item.subItems.filter(con =>
                trangDuocPhep.includes(con.id)
              );
              // Hide group completely if role cannot access any subitems
              if (accessibleSubItems.length === 0) {
                return null;
              }

              return (
                <div key={item.id} className="pt-1.5 pb-0.5">
                  {/* Parent Title */}
                  <div
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isPhieuActive
                        ? 'bg-purple-50 text-purple-900 border border-purple-200/70 shadow-2xs'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </div>

                  {/* Only Accessible Sub-items */}
                  <div className="ml-4 pl-2 space-y-1 mt-1 mb-1 border-l-2 border-slate-100">
                    {accessibleSubItems.map(con => {
                      const isSelected = activeTab === con.id;
                      const isNhap = con.subColor === 'emerald';

                      return (
                        <button
                          key={con.id}
                          onClick={() => setActiveTab(con.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition text-left cursor-pointer ${
                            isSelected
                              ? isNhap
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'bg-rose-600 text-white font-bold shadow-xs'
                              : isNhap
                              ? 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                              : 'text-slate-700 hover:bg-rose-50 hover:text-rose-800'
                          }`}
                        >
                          {con.icon}
                          <span className={isSelected ? 'font-bold' : 'font-semibold'}>
                            {con.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const hasAccess = trangDuocPhep.includes(item.id);
            // Hide menu item completely if role lacks permission
            if (!hasAccess) {
              return null;
            }

            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition text-left cursor-pointer ${
                  isSelected
                    ? 'bg-purple-100 text-purple-900 font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User info at bottom */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
            {currentUser.ten ? currentUser.ten.charAt(0) : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser.ten}</p>
            <p className="text-[10px] text-slate-500 truncate">{roleInfo.ten}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={resetToDefault}
            title="Đặt lại dữ liệu gốc ban đầu"
            className="p-1.5 text-xs text-slate-500 hover:text-purple-600 hover:bg-white rounded-lg border border-slate-200 transition font-medium flex items-center justify-center shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={logout}
            title="Đăng xuất khỏi hệ thống"
            className="p-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg border border-slate-200 transition font-medium flex items-center justify-center shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
