import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CurrentUser,
  NhaCungCap,
  NhatKy,
  PhieuHang,
  SanPham,
  TabKey,
  User,
  UserRole,
} from '../types';
import { PHAN_QUYEN_HE_THONG, StockStore } from '../services/store';
import { api } from '../services/api';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  isAuthenticated: boolean;
  currentUser: CurrentUser;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  sanPhamList: SanPham[];
  phieuList: PhieuHang[];
  nccList: NhaCungCap[];
  nhanSuList: User[];
  nhatKyList: NhatKy[];
  toasts: ToastItem[];
  refreshAll: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  loginWithCredentials: (emailOrUser: string, pass: string) => Promise<boolean>;
  loginAsRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  resetToDefault: () => void;
  syncWithDatabase: (payload?: { filePath?: string; config?: any }) => Promise<void>;
  dbStatus: any;
  connectMySql: (config: any) => Promise<boolean>;
  pushToMySql: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('stockflow_is_authenticated');
    return saved === null ? false : saved === 'true';
  });
  const [currentUser, setCurrentUserState] = useState<CurrentUser>(() => StockStore.getCurrentUser());
  const [activeTab, setActiveTabState] = useState<TabKey>('tong-quan');
  const [sanPhamList, setSanPhamList] = useState<SanPham[]>(() => StockStore.getSanPham());
  const [phieuList, setPhieuList] = useState<PhieuHang[]>(() => StockStore.getPhieu());
  const [nccList, setNccList] = useState<NhaCungCap[]>(() => StockStore.getNhaCungCap());
  const [nhanSuList, setNhanSuList] = useState<User[]>(() => StockStore.getNhanSu());
  const [nhatKyList, setNhatKyList] = useState<NhatKy[]>(() => StockStore.getNhatKy());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);

  const refreshAll = () => {
    setCurrentUserState(StockStore.getCurrentUser());
    setSanPhamList(StockStore.getSanPham());
    setPhieuList(StockStore.getPhieu());
    setNccList(StockStore.getNhaCungCap());
    setNhanSuList(StockStore.getNhanSu());
    setNhatKyList(StockStore.getNhatKy());
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActiveTab = (tab: TabKey) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginWithCredentials = async (emailOrUser: string, pass: string): Promise<boolean> => {
    const input = emailOrUser.trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    if (!input) {
      showToast('Vui lòng nhập Email hoặc Mã nhân viên!', 'error');
      return false;
    }
    if (!cleanPass) {
      showToast('Vui lòng nhập mật khẩu!', 'error');
      return false;
    }

    try {
      const res = await api.login(input, cleanPass);
      if (res && res.success && res.user) {
        const u = res.user;
        const newUser: CurrentUser = {
          id: u.id,
          ten: u.ten,
          email: u.email,
          vaiTro: (u.vaiTro as UserRole) || 'staff',
          chucDanh: u.vaiTroGoc || PHAN_QUYEN_HE_THONG[u.vaiTro as UserRole]?.ten || 'Nhân viên kho'
        };

        StockStore.setCurrentUser(newUser);
        setCurrentUserState(newUser);
        localStorage.setItem('stockflow_is_authenticated', 'true');
        setIsAuthenticated(true);
        refreshAll();
        setActiveTabState('tong-quan');
        showToast(`Xin chào ${u.ten}! Đăng nhập thành công với vai trò ${u.vaiTroGoc || PHAN_QUYEN_HE_THONG[u.vaiTro as UserRole]?.ten}`, 'success');
        return true;
      } else {
        showToast(res?.message || 'Tài khoản hoặc mật khẩu không chính xác!', 'error');
        return false;
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Tài khoản hoặc mật khẩu không chính xác! Vui lòng thử lại.';
      showToast(errorMsg, 'error');
      return false;
    }
  };

  const loginAsRole = (role: UserRole) => {
    const staff = StockStore.getNhanSu();
    let target = staff.find(u => u.vaiTro === role);
    if (!target) {
      target = {
        id: 'u_' + role,
        ten: PHAN_QUYEN_HE_THONG[role].ten,
        email: `${role}@stockflow.vn`,
        vaiTro: role,
        trangThai: 'active'
      };
    }

    const newUser: CurrentUser = {
      id: target.id,
      ten: target.ten,
      email: target.email,
      vaiTro: role,
      chucDanh: target.phongBan || PHAN_QUYEN_HE_THONG[role].ten
    };

    StockStore.setCurrentUser(newUser);
    StockStore.ghiNhatKy(
      'ĐĂNG NHẬP',
      'Hệ thống',
      `Đăng nhập phiên với vai trò ${PHAN_QUYEN_HE_THONG[role].ten}`
    );

    localStorage.setItem('stockflow_is_authenticated', 'true');
    setIsAuthenticated(true);
    refreshAll();
    setActiveTabState('tong-quan');
    showToast(`Đã đăng nhập thành công với vai trò: ${PHAN_QUYEN_HE_THONG[role].ten}`, 'success');
  };

  const switchRole = (newRole: UserRole) => {
    const user = StockStore.getCurrentUser();
    const updated = { ...user, vaiTro: newRole, chucDanh: PHAN_QUYEN_HE_THONG[newRole].ten };
    StockStore.setCurrentUser(updated);

    // Also update in staff list
    const staff = StockStore.getNhanSu();
    const idx = staff.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      staff[idx].vaiTro = newRole;
      StockStore.setNhanSu(staff);
    }

    StockStore.ghiNhatKy(
      'CHUYỂN VAI TRÒ',
      user.ten,
      `Đổi vai trò làm việc sang: ${PHAN_QUYEN_HE_THONG[newRole].ten}`
    );

    refreshAll();
    showToast(`Đã chuyển vai trò sang: ${PHAN_QUYEN_HE_THONG[newRole].ten}`, 'info');

    // Route guard check
    const allowed = PHAN_QUYEN_HE_THONG[newRole].trangDuocPhep;
    if (!allowed.includes(activeTab)) {
      setActiveTabState('tong-quan');
    }
  };

  const logout = () => {
    StockStore.ghiNhatKy('ĐĂNG XUẤT', 'Hệ thống', `Tài khoản ${currentUser.ten} đã đăng xuất`);
    localStorage.setItem('stockflow_is_authenticated', 'false');
    setIsAuthenticated(false);
    showToast('Đã đăng xuất khỏi hệ thống', 'info');
  };

  const resetToDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu mẫu ban đầu?')) {
      StockStore.datLaiMacDinh();
      refreshAll();
      setActiveTabState('tong-quan');
      showToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!', 'success');
    }
  };

  const syncWithDatabase = async (payload?: { filePath?: string; config?: any }) => {
    try {
      showToast('Đang kết nối & đồng bộ dữ liệu từ CSDL MySQL...', 'info');
      const syncRes = await api.syncDatabase(payload).catch((err: any) => ({ success: false, message: err.message }));
      
      const [prods, recs, sups, stf, logs, status] = await Promise.all([
        api.getProducts().catch(() => null),
        api.getReceipts().catch(() => null),
        api.getSuppliers().catch(() => null),
        api.getStaff().catch(() => null),
        api.getAuditLogs().catch(() => null),
        api.getDbStatus().catch(() => null)
      ]);

      if (status?.data) {
        setDbStatus(status.data);
      }

      if (prods && prods.length > 0) {
        setSanPhamList(prods);
        StockStore.setSanPham(prods);
      }
      if (recs && recs.length > 0) {
        setPhieuList(recs);
        StockStore.setPhieu(recs);
      }
      if (sups && sups.length > 0) {
        setNccList(sups);
        StockStore.setNhaCungCap(sups);
      }
      if (stf && stf.length > 0) {
        setNhanSuList(stf);
        StockStore.setNhanSu(stf);
      }
      if (logs && logs.length > 0) {
        setNhatKyList(logs);
        StockStore.setNhatKy(logs);
      }
      refreshAll();
      
      if (syncRes && syncRes.message) {
        showToast(syncRes.message, syncRes.success ? 'success' : 'info');
      } else {
        showToast('Đã đồng bộ dữ liệu mới nhất thành công từ CSDL!', 'success');
      }
    } catch (e: any) {
      showToast('Lỗi khi tải lại dữ liệu từ CSDL: ' + e.message, 'error');
    }
  };

  const connectMySql = async (config: any): Promise<boolean> => {
    try {
      showToast('Đang kiểm tra kết nối đến máy chủ MySQL...', 'info');
      const res = await api.connectMySql(config);
      if (res.success) {
        showToast(res.message, 'success');
        await syncWithDatabase();
        return true;
      } else {
        showToast(res.message, 'error');
        return false;
      }
    } catch (e: any) {
      showToast('Lỗi kết nối MySQL: ' + e.message, 'error');
      return false;
    }
  };

  const pushToMySql = async (): Promise<boolean> => {
    try {
      showToast('Đang đẩy dữ liệu từ Web lên máy chủ MySQL...', 'info');
      const res = await api.pushToMySql();
      if (res.success) {
        showToast(res.message, 'success');
        return true;
      } else {
        showToast(res.message, 'error');
        return false;
      }
    } catch (e: any) {
      showToast('Lỗi đẩy dữ liệu lên MySQL: ' + e.message, 'error');
      return false;
    }
  };

  // Hydrate data from Backend API and MySQL Database on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, recs, sups, stf, logs, status] = await Promise.all([
          api.getProducts().catch(() => null),
          api.getReceipts().catch(() => null),
          api.getSuppliers().catch(() => null),
          api.getStaff().catch(() => null),
          api.getAuditLogs().catch(() => null),
          api.getDbStatus().catch(() => null)
        ]);

        if (status?.data) {
          setDbStatus(status.data);
        }

        if (prods && prods.length > 0) {
          setSanPhamList(prods);
          StockStore.setSanPham(prods);
        }
        if (recs && recs.length > 0) {
          setPhieuList(recs);
          StockStore.setPhieu(recs);
        }
        if (sups && sups.length > 0) {
          setNccList(sups);
          StockStore.setNhaCungCap(sups);
        }
        if (stf && stf.length > 0) {
          setNhanSuList(stf);
          StockStore.setNhanSu(stf);
        }
        if (logs && logs.length > 0) {
          setNhatKyList(logs);
          StockStore.setNhatKy(logs);
        }
      } catch (e) {
        console.warn('[Sync] Không thể nạp dữ liệu từ backend API:', e);
      }
    };

    fetchData();
  }, []);

  // Sync on tab change or storage events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('stockflow_')) {
        refreshAll();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeTab,
        setActiveTab,
        sanPhamList,
        phieuList,
        nccList,
        nhanSuList,
        nhatKyList,
        toasts,
        refreshAll,
        showToast,
        dismissToast,
        loginWithCredentials,
        loginAsRole,
        switchRole,
        logout,
        resetToDefault,
        syncWithDatabase,
        dbStatus,
        connectMySql,
        pushToMySql
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
