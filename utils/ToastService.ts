// utils/ToastService.ts
// A lightweight module-level toast emitter so non-React code (e.g. the API
// request layer) can trigger toasts without hooks. The ToastProvider registers
// itself as the active listener when it mounts.

export type ToastType = 'error' | 'success' | 'info' | 'warning';

type ToastListener = (message: string, type: ToastType, duration?: number) => void;

let listener: ToastListener | null = null;

export const setToastListener = (l: ToastListener | null) => {
  listener = l;
};

export const toast = {
  show: (message: string, type: ToastType = 'info', duration = 3200) => {
    listener?.(message, type, duration);
  },
  error: (message: string, duration?: number) => toast.show(message, 'error', duration),
  success: (message: string, duration?: number) => toast.show(message, 'success', duration),
  info: (message: string, duration?: number) => toast.show(message, 'info', duration),
  warning: (message: string, duration?: number) => toast.show(message, 'warning', duration),
};
