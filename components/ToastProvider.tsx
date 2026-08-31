import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Toast, { ToastData } from './Toast';
import { setToastListener, ToastType } from '../utils/ToastService';

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => useContext(ToastContext);

const MAX_VISIBLE = 3;

let toastId = 0;

export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3200) => {
    const id = `toast_${++toastId}`;
    setToasts(prev => {
      const next = [...prev, { id, message, type, duration }];
      // Keep only the most recent three visible at once.
      return next.slice(-MAX_VISIBLE);
    });
    // Safety-timeout fallback so toasts always clear even if animations break.
    timeoutRefs.current[id] = setTimeout(() => dismiss(id), duration + 250);
  }, [dismiss]);

  const hideToast = useCallback((id?: string) => {
    if (id) {
      dismiss(id);
    } else {
      setToasts(prev => prev.slice(0, -1));
    }
  }, [dismiss]);

  useEffect(() => {
    setToastListener(showToast);
    return () => setToastListener(null);
  }, [showToast]);

  // Clean up any pending timers on unmount.
  useEffect(() => {
    const refs = timeoutRefs.current;
    return () => {
      Object.values(refs).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((t, idx) => (
          <View key={t.id} style={[styles.toastWrap, { top: idx * 72 }]}>
            <Toast toast={t} onDismiss={dismiss} />
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  toastWrap: {
    width: '100%',
  },
});

export default ToastProvider;
