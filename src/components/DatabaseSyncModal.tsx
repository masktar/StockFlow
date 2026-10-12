import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, RefreshCw, X, Server, CheckCircle2, AlertCircle, FileCode, Check, Download } from 'lucide-react';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSyncModal: React.FC<DatabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const { dbStatus, syncWithDatabase, connectMySql, pushToMySql, showToast } = useApp();

  const [host, setHost] = useState(dbStatus?.host || '127.0.0.1');
  const [port, setPort] = useState(String(dbStatus?.port || 3306));
  const [user, setUser] = useState(dbStatus?.user || 'root');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState(dbStatus?.databaseName || 'qlykho');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMode, setActiveMode] = useState<'sync' | 'config'>('sync');

  if (!isOpen) return null;

  const isMySqlLive = dbStatus?.connectedToMySql;

  const handleQuickSync = async () => {
    setIsProcessing(true);
    try {
      await syncWithDatabase();
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePushData = async () => {
    setIsProcessing(true);
    try {
      await pushToMySql();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncFromSqlFile = async () => {
    setIsProcessing(true);
    try {
      await syncWithDatabase({ filePath: 'qlykho_new.sql' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConnectMySql = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const ok = await connectMySql({
        host,
        port: Number(port),
        user,
        password,
        database
      });
      if (ok) {
        showToast(`Đã kết nối và đồng bộ trực tiếp từ máy chủ MySQL ${host}:${port}/${database}!`, 'success');
        onClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isMySqlLive ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Đồng bộ Cơ sở dữ liệu (MySQL / CSDL)</h3>
              <p className="text-[11px] text-slate-500">Quản lý kết nối và đồng bộ dữ liệu hai chiều với MySQL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isMySqlLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-semibold text-slate-700">Trạng thái:</span>
              <span className={`font-bold ${isMySqlLive ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isMySqlLive ? '🟢 Kết nối Trực tiếp MySQL' : '🟡 Dữ liệu CSDL qlykho (Đồng bộ với Dump SQL)'}
              </span>
            </div>
            {dbStatus?.lastSyncedAt && (
              <span className="text-[11px] text-slate-400">Đồng bộ lúc: {dbStatus.lastSyncedAt}</span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3 text-center text-[11px]">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="font-bold text-slate-800 text-xs">{dbStatus?.totalProducts || 50}</div>
              <div className="text-slate-500 text-[10px]">Sản phẩm</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="font-bold text-slate-800 text-xs">{dbStatus?.totalWarehouses || 50}</div>
              <div className="text-slate-500 text-[10px]">Kho hàng</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="font-bold text-slate-800 text-xs">{dbStatus?.totalEmployees || 50}</div>
              <div className="text-slate-500 text-[10px]">Nhân viên</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="font-bold text-slate-800 text-xs">{dbStatus?.totalReceipts || 50}</div>
              <div className="text-slate-500 text-[10px]">Phiếu xuất/nhập</div>
            </div>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveMode('sync')}
            className={`pb-2.5 transition border-b-2 cursor-pointer ${
              activeMode === 'sync'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Đồng bộ dữ liệu
          </button>
          <button
            onClick={() => setActiveMode('config')}
            className={`pb-2.5 transition border-b-2 cursor-pointer ${
              activeMode === 'config'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Cấu hình kết nối MySQL
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeMode === 'sync' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/60 text-xs text-blue-900 leading-relaxed">
                <div className="font-bold mb-1 flex items-center gap-1.5 text-blue-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  Đồng bộ hai chiều thời gian thực (2-Way Sync):
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] mt-1">
                  <li><strong>Từ MySQL &rarr; Web:</strong> Khi bạn sửa dữ liệu bên MySQL hoặc file <code className="px-1 py-0.5 bg-blue-100 rounded text-blue-950 font-mono text-[10px]">qlykho_new.sql</code>, bấm <em>"Đồng bộ về Web"</em> để nạp dữ liệu mới.</li>
                  <li><strong>Từ Web &rarr; MySQL:</strong> Khi bạn thêm/sửa/xóa sản phẩm, nhân viên, tạo phiếu trên web, hệ thống tự động ghi trực tiếp vào MySQL và cập nhật file SQL. Bạn cũng có thể bấm <em>"Đẩy toàn bộ Web lên MySQL"</em> để đồng bộ hàng loạt.</li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleQuickSync}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-between p-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    <div className="text-left">
                      <div>Kéo dữ liệu từ MySQL về Web</div>
                      <div className="text-[10px] font-normal text-blue-100">
                        {isMySqlLive ? 'Đọc và đồng bộ dữ liệu mới nhất từ máy chủ MySQL' : 'Nạp lại toàn bộ dữ liệu CSDL mới nhất'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] bg-blue-500/50 px-2 py-0.5 rounded-md">MySQL &rarr; Web</span>
                </button>

                {isMySqlLive && (
                  <button
                    onClick={handlePushData}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-between p-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Server className={`w-4 h-4 ${isProcessing ? 'animate-pulse' : ''}`} />
                      <div className="text-left">
                        <div>Đẩy toàn bộ dữ liệu từ Web lên MySQL</div>
                        <div className="text-[10px] font-normal text-emerald-100">
                          Ghi đè và cập nhật toàn bộ bảng sang máy chủ MySQL
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] bg-emerald-500/50 px-2 py-0.5 rounded-md">Web &rarr; MySQL</span>
                  </button>
                )}

                <button
                  onClick={handleSyncFromSqlFile}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-slate-500" />
                    <div className="text-left">
                      <div>Đồng bộ lại từ file SQL Dump (qlykho_new.sql)</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Nạp lại các lệnh INSERT từ file qlykho_new.sql
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">qlykho_new.sql</span>
                </button>

                <a
                  href="/api/db/export-sql"
                  download="qlykho_new.sql"
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <div className="text-left">
                      <div>Tải file SQL cập nhật mới nhất (qlykho_new.sql)</div>
                      <div className="text-[10px] text-emerald-700 font-normal">
                        Lưu file đã đồng bộ đầy đủ các thay đổi trên Web để import MySQL
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Tải SQL</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnectMySql} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700">Máy chủ (Host / IP)</label>
                  <input
                    type="text"
                    value={host}
                    onChange={e => setHost(e.target.value)}
                    placeholder="127.0.0.1 hoặc localhost"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Cổng (Port)</label>
                  <input
                    type="number"
                    value={port}
                    onChange={e => setPort(e.target.value)}
                    placeholder="3306"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tên CSDL (Database)</label>
                <input
                  type="text"
                  value={database}
                  onChange={e => setDatabase(e.target.value)}
                  placeholder="qlykho"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tài khoản (User)</label>
                  <input
                    type="text"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    placeholder="root"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Mật khẩu (Password)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Để trống nếu không có"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang kiểm tra kết nối...</span>
                  </>
                ) : (
                  <>
                    <Server className="w-3.5 h-3.5" />
                    <span>Kiểm tra & Kết nối máy chủ MySQL</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
