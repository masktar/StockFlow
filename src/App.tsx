import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { AccessDenied } from './components/AccessDenied';
import { LoginScreen } from './components/LoginScreen';
import { DashboardTab } from './components/tabs/DashboardTab';
import { ProductsTab } from './components/tabs/ProductsTab';
import { ReceiptInboundTab } from './components/tabs/ReceiptInboundTab';
import { ReceiptOutboundTab } from './components/tabs/ReceiptOutboundTab';
import { SuppliersTab } from './components/tabs/SuppliersTab';
import { StaffTab } from './components/tabs/StaffTab';
import { AuditLogTab } from './components/tabs/AuditLogTab';
import { PHAN_QUYEN_HE_THONG } from './services/store';

const MainContent: React.FC = () => {
  const { activeTab, currentUser, isAuthenticated } = useApp();
  const roleInfo = PHAN_QUYEN_HE_THONG[currentUser.vaiTro] || PHAN_QUYEN_HE_THONG.staff;

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <Toast />
      </>
    );
  }

  // RBAC Permission Check
  const isAllowed = roleInfo.trangDuocPhep.includes(activeTab);

  const renderActiveTab = () => {
    if (!isAllowed) {
      return <AccessDenied />;
    }

    switch (activeTab) {
      case 'tong-quan':
        return <DashboardTab />;
      case 'hang-hoa':
        return <ProductsTab />;
      case 'nhap-kho':
        return <ReceiptInboundTab />;
      case 'xuat-kho':
        return <ReceiptOutboundTab />;
      case 'nha-cung-cap':
        return <SuppliersTab />;
      case 'nhan-su':
        return <StaffTab />;
      case 'nhat-ky':
        return <AuditLogTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global Toast Alerts */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
