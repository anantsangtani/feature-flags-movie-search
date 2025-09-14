interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration: number;
  }
  
  class ToastManager {
    private toasts: Toast[] = [];
    private listeners: ((toasts: Toast[]) => void)[] = [];
  
    subscribe(listener: (toasts: Toast[]) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
  
    private notify() {
      this.listeners.forEach(listener => listener([...this.toasts]));
    }
  
    private addToast(type: Toast['type'], message: string, duration = 5000) {
      const id = Math.random().toString(36).substring(2, 9);
      const toast: Toast = { id, type, message, duration };
      
      this.toasts.push(toast);
      this.notify();
  
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
  
      return id;
    }
  
    removeToast(id: string) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
      this.notify();
    }
  
    success(message: string, duration?: number) {
      return this.addToast('success', message, duration);
    }
  
    error(message: string, duration?: number) {
      return this.addToast('error', message, duration);
    }
  
    warning(message: string, duration?: number) {
      return this.addToast('warning', message, duration);
    }
  
    info(message: string, duration?: number) {
      return this.addToast('info', message, duration);
    }
  
    clear() {
      this.toasts = [];
      this.notify();
    }
  }
  
  export const toast = new ToastManager();
  