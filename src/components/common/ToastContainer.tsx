import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 bg-white text-stone-900',
          error: 'border-rose-200 bg-white text-stone-900',
          warning: 'border-amber-200 bg-white text-stone-900',
          info: 'border-sky-200 bg-white text-stone-900',
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg shadow-stone-900/5 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${borders[toast.type]}`}
            role="alert"
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{toast.message}</p>
              )}
              {toast.action && (
                <button
                  type="button"
                  id={`toast-action-${toast.id}`}
                  onClick={toast.action.onClick}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              id={`toast-close-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-600 p-0.5 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
