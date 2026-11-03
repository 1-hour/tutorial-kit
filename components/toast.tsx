'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Toast = {
  id: number;
  message: string;
  variant: 'default' | 'success' | 'error';
};

type ToastContextValue = {
  toast: (message: string, variant?: Toast['variant']) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Lightweight toast system — one provider at page root, call useToast().toast()
 * from any child. No external deps. Replaces alert() across the site.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (message: string, variant: Toast['variant'] = 'default') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2600);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:top-6"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const color =
    toast.variant === 'success'
      ? 'border-green-500/40 bg-green-50 text-green-900 dark:bg-green-950/60 dark:text-green-100'
      : toast.variant === 'error'
        ? 'border-red-500/40 bg-red-50 text-red-900 dark:bg-red-950/60 dark:text-red-100'
        : 'border-foreground/10 bg-background text-foreground';

  const icon =
    toast.variant === 'success' ? '✓' : toast.variant === 'error' ? '✕' : '•';

  return (
    <div
      className={`pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur transition-all duration-200 ${color} ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
      role="status"
    >
      <span aria-hidden className="font-bold">
        {icon}
      </span>
      <span>{toast.message}</span>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback no-op if provider missing (shouldn't happen but keeps TS happy)
    return {
      toast: (msg: string) => {
        if (typeof console !== 'undefined') console.log('[toast]', msg);
      },
    };
  }
  return ctx;
}
