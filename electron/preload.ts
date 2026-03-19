import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getVersion: () => process.env.npm_package_version || '1.0.0',
  
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // App controls
  reload: () => ipcRenderer.invoke('app-reload'),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('app-toggle-always-on-top'),
  
  // System information
  platform: process.platform,
  
  // Notification API bridge
  showNotification: (title: string, body: string, options?: NotificationOptions) => {
    return new Promise((resolve, reject) => {
      const notification = new Notification(title, {
        body,
        icon: 'assets/icon.ico',
        ...options
      });
      
      notification.onclick = () => {
        resolve(true);
      };
      
      notification.onerror = (error) => {
        reject(error);
      };
    });
  },
  
  // Session management
  clearSession: () => ipcRenderer.invoke('clear-session'),
  
  // Development mode check
  isDevMode: () => process.argv.includes('--dev')
});

// Handle notification requests from the web app
if ('Notification' in window) {
  const OriginalNotification = window.Notification;
  
  window.Notification = class extends OriginalNotification {
    constructor(title: string, options?: NotificationOptions) {
      super(title, {
        icon: 'assets/icon.ico',
        ...options
      });
    }
  } as typeof Notification;
}

// Console logging for debugging
console.log('CoreGuard Control Preload Script Loaded');
