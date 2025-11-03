"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Toast = {
  id: string;
  message: string;
};

type ToastContextType = {
  show: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (message: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    // Auto dismiss after 2.2s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  };

  const value = useMemo(() => ({ show }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed', top: 16, right: 16, zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: 8,
      }} aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} style={{
            background: '#111', color: '#fff', padding: '10px 14px',
            borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
