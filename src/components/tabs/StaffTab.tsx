import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockStore, PHAN_QUYEN_HE_THONG } from '../../services/store';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import { Plus, Edit2, Trash2, X, ShieldCheck } from 'lucide-react';

export const StaffTab: React.FC = () => {
  const { nhanSuList, currentUser, refreshAll, showToast } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    ten: '',
    email: '',
    dienThoai: '',
    phongBan: 'Kho Tổng Hà Nội',
    vaiTro: 'staff',
    trangThai: 'active'
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const target = nhanSuList.find(u => u.id === userId);
    if (!target) return;

    StockStore.capNhatNhanSu(userId, { vaiTro: newRole });
    StockStore.ghiNhatKy(
      'PHÂN QUYỀN NHÂN VIÊN',
      target.ten,
      `Thay đổi vai trò của ${target.ten} thành ${newRole.toUpperCase()}`
    );

    // If current logged-in user is updated, update session too
    if (currentUser.id === userId) {
      StockStore.setCurrentUser({ ...currentUser, vaiTro: newRole });
    }

    refreshAll();
    showToast(`Đã cập nhật vai trò của ${target.ten} sang "${newRole}"!`, 'success');
  };

  const handleStatusToggle = (user: User) => {
    const newStatus = user.trangThai === 'active' ? 'inactive' : 'active';
    StockStore.capNhatNhanSu(user.id, { trangThai: newStatus });
    refreshAll();
    showToast(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'tạm khóa'} tài khoản ${user.ten}!`, 'info');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ten.trim() || !formData.email.trim()) {
      showToast('Vui lòng điền đầy đủ họ tên và email!', 'error');
      return;
    }

    if (nhanSuList.some(u => u.email.toLowerCase() === formData.email.trim().toLowerCase())) {
      showToast(`Email "${formData.email}" đã tồn tại trong hệ thống!`, 'error');
      return;
    }

    StockStore.themNhanSu(formData);
    api.createStaff(formData).catch(e => console.warn('[MySQL Sync] Lỗi tạo nhân viên:', e));
    refreshAll();
    setIsAddModalOpen(false);
    showToast(`Đã thêm nhân viên ${formData.ten} thành công!`, 'success');

    setFormData({
      ten: '',
      email: '',
      dienThoai: '',
      phongBan: 'Kho Tổng Hà Nội',
      vaiTro: 'staff',
      trangThai: 'active'
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    StockStore.capNhatNhanSu(editingUser.id, editingUser);
    refreshAll();
    setEditingUser(null);
    showToast(`Đã cập nhật thông tin nhân viên ${editingUser.ten}!`, 'success');
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (id === currentUser.id) {
      showToast('Không thể xóa tài khoản bạn đang đăng nhập!', 'error');
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản nhân viên "${name}"?`)) {
      StockStore.xoaNhanSu(id);
      refreshAll();
      showToast(`Đã xóa nhân viên "${name}"!`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Mô hình phân quyền kiểm soát vai trò (RBAC)
            </h3>
            <p className="text-xs text-slate-500">
              Danh sách nhân sự và vai trò tương ứng cố định theo tài khoản hệ thống
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-200 transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Nhân viên mới</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Họ và Tên</th>
                <th className="py-3.5 px-4 font-bold">Email</th>
                <th className="py-3.5 px-4 font-bold">Điện thoại</th>
                <th className="py-3.5 px-4 font-bold">Bộ phận phụ trách</th>
                <th className="py-3.5 px-4 font-bold">Vai trò hệ thống (RBAC)</th>
                <th className="py-3.5 px-4 font-bold text-center">Trạng thái</th>
                <th className="py-3.5 px-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nhanSuList.map(user => {
                const isCurrent = user.id === currentUser.id;
                const isActive = user.trangThai === 'active';

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{user.ten}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                            Bạn
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{user.email}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {user.dienThoai || 'Chưa cập nhật'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{user.phongBan}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/70">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{PHAN_QUYEN_HE_THONG[user.vaiTro]?.ten || user.vaiTro}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                        title="Bấm để đổi trạng thái"
                      >
                        {isActive ? 'Hoạt động' : 'Tạm khóa'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingUser({ ...user })}
                          className="p-1.5 hover:bg-purple-50 text-slate-500 hover:text-purple-700 rounded-lg transition"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          disabled={isCurrent}
                          onClick={() => handleDeleteUser(user.id, user.ten)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded-lg transition"
                          title={isCurrent ? 'Không thể xóa tài khoản hiện tại' : 'Xóa nhân sự'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM NHÂN SỰ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Thêm Nhân viên mới</h3>
                <p className="text-slate-400 text-[11px]">Đăng ký tài khoản và phân quyền hệ thống</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Họ và tên (*)
                </label>
                <input
                  type="text"
                  required
                  value={formData.ten}
                  onChange={e => setFormData({ ...formData, ten: e.target.value })}
                  placeholder="VD: Lê Hoàng Nam"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Email (*)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nam.le@khohang.vn"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.dienThoai}
                    onChange={e => setFormData({ ...formData, dienThoai: e.target.value })}
                    placeholder="0903 555 789"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Bộ phận công tác (*)
                </label>
                <select
                  value={formData.phongBan}
                  onChange={e => setFormData({ ...formData, phongBan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Kho Tổng Hà Nội">Kho Tổng Hà Nội</option>
                  <option value="Kho Chi nhánh Bình Dương">Kho Chi nhánh Bình Dương</option>
                  <option value="Kho Đà Nẵng">Kho Đà Nẵng</option>
                  <option value="Quản lý Điều phối">Quản lý Điều phối</option>
                  <option value="Kế toán Kho">Kế toán Kho</option>
                  <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Vai trò hệ thống (RBAC) (*)
                </label>
                <select
                  value={formData.vaiTro}
                  onChange={e => setFormData({ ...formData, vaiTro: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-purple-600"
                >
                  <option value="admin">1. Admin</option>
                  <option value="manager">2. Quản lý</option>
                  <option value="staff">3. Thủ kho</option>
                  <option value="accountant">4. Kế toán kho</option>
                  <option value="supervisor">5. Giám sát</option>
                  <option value="employee">6. Nhân viên</option>
                </select>
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
                  Lưu nhân viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA NHÂN SỰ */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Sửa thông tin nhân viên</h3>
                <p className="text-slate-400 text-[11px]">{editingUser.ten}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Họ và tên (*)
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.ten}
                  onChange={e => setEditingUser({ ...editingUser, ten: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Email (*)
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editingUser.dienThoai || ''}
                    onChange={e => setEditingUser({ ...editingUser, dienThoai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Bộ phận công tác
                </label>
                <input
                  type="text"
                  value={editingUser.phongBan || ''}
                  onChange={e => setEditingUser({ ...editingUser, phongBan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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
    </div>
  );
};
