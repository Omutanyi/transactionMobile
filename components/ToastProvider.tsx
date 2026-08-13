import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast from './Toast';

type ToastType = 'error' | 'success' | 'info';

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>('info');

  const showToast = useCallback((msg: string, t: ToastType = 'info', duration = 3000) => {
    setMessage(msg);
    setType(t);
    // clear after duration
    setTimeout(() => setMessage(null), duration + 100);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={message} type={type} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
