import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Icon from './Icon';

const ToastContext = createContext(null);

let idSeq = 0;
const EXIT_MS = 220;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => remove(id), EXIT_MS);
  }, [remove]);

  const push = useCallback((message, type = 'success', duration = 4200) => {
    const id = ++idSeq;
    setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const toast = {
    success: (msg, duration) => push(msg, 'success', duration),
    error: (msg, duration) => push(msg, 'error', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type} ${t.leaving ? 'toast-leaving' : ''}`}>
            <span className="toast-icon">
              <Icon name={t.type === 'success' ? 'checkCircle' : 'alertCircle'} size={16} />
            </span>
            <span className="toast-message">{t.message}</span>
            <button
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              <Icon name="x" size={14} />
            </button>
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
