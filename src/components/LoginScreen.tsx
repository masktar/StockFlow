import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithCredentials, showToast } = useApp();

  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser.trim()) {
      showToast('Vui lòng nhập Email hoặc Tên đăng nhập!', 'error');
      return;
    }
    if (!password) {
      showToast('Vui lòng nhập mật khẩu!', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithCredentials(emailOrUser, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-[#eaf2ff] via-[#f4f7fc] to-[#ffffff] relative overflow-hidden">
      {/* Subtle ambient lighting glows matching user's design */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-300/30 via-indigo-200/25 to-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Left Brand Header */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
            <Logo size={22} color="#ffffff" strokeWidth={8} />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">StockFlow</span>
        </div>
      </header>

      {/* Centered Login Card - exactly matching mockup */}
      <main className="my-auto py-8 z-10 flex items-center justify-center w-full">
        <div className="max-w-[440px] w-full bg-white/95 backdrop-blur-md rounded-[2.2rem] shadow-2xl shadow-blue-900/10 border border-slate-100 p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-200">
          {/* Top Blue Icon */}
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-600/30">
            <Logo size={32} color="#ffffff" strokeWidth={7.5} />
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng nhập</h1>
          <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
            Chào mừng quay trở lại hệ thống quản lý kho vận thông minh StockFlow
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            <div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Email hoặc Tên đăng nhập"
                  value={emailOrUser}
                  onChange={e => setEmailOrUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none transition shadow-2xs bg-white text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none transition shadow-2xs bg-white text-slate-800 placeholder-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() =>
                  showToast('Vui lòng liên hệ Quản trị viên để đặt lại mật khẩu!', 'info')
                }
                className="text-[11px] text-slate-500 hover:text-blue-600 font-medium transition"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#111827] hover:bg-slate-800 disabled:opacity-75 text-white text-xs font-bold rounded-2xl shadow-lg shadow-slate-900/15 transition transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <span>{isLoading ? 'Đang xử lý...' : 'Đăng nhập'}</span>
              {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-400 z-10 py-2">
        StockFlow &copy; {new Date().getFullYear()} - Nền tảng quản lý kho vận thông minh đa chi nhánh
      </footer>
    </div>
  );
};
