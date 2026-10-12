import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold text-white transition-all transform animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-emerald-600 border-emerald-500 shadow-emerald-900/20'
                : isError
                ? 'bg-rose-600 border-rose-500 shadow-rose-900/20'
                : 'bg-slate-800 border-slate-700 shadow-slate-900/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />}
              {isError && <AlertCircle className="w-4 h-4 shrink-0 text-rose-200" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 shrink-0 text-slate-300" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-white/70 hover:text-white transition p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
