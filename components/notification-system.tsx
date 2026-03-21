"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X, AlertTriangle, Info, AlertCircle } from "lucide-react";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (notification.autoClose && notification.duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(notification.id), 300);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.autoClose, notification.duration, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-[#2b9875]" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Info className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-[#232531]";
      case "error":
        return "bg-red-900";
      case "warning":
        return "bg-yellow-900";
      case "info":
        return "bg-blue-900";
      default:
        return "bg-gray-800";
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(notification.id), 300);
  };

  return (
    <>
      <style jsx>{`
        /* From Uiverse.io by seyed-mohsen-mousavi */
        .notification-container {
          transition: all 0.3s ease-in-out;
          transform: translateX(0);
          opacity: 1;
        }

        .notification-container.hiding {
          transform: translateX(100%);
          opacity: 0;
        }

        .notification-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: auto;
          min-height: 48px;
          max-height: 56px;
          border-radius: 8px;
          padding: 8px 10px;
          transition: all 0.2s ease-in-out;
        }

        .notification-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .notification-content {
          display: flex;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }

        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .notification-title {
          color: white;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.2;
          margin: 0;
        }

        .notification-message {
          color: rgb(156, 163, 175);
          font-size: 9px;
          line-height: 1.2;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notification-close {
          color: rgb(156, 163, 175);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          flex-shrink: 0;
        }

        .notification-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        @media (min-width: 640px) {
          .notification-card {
            height: 56px;
            padding: 10px;
          }

          .notification-title {
            font-size: 11px;
          }

          .notification-message {
            font-size: 10px;
          }
        }
      `}</style>

      <div className={`notification-container ${!isVisible ? 'hiding' : ''}`}>
        <div className={`notification-card ${getBgColor()}`}>
          <div className="notification-content">
            <div className="notification-icon">
              <div className="text-white/5 backdrop-blur-xl p-1 rounded-lg">
                {getIcon()}
              </div>
            </div>
            <div className="notification-text">
              <p className="notification-title">{notification.title}</p>
              <p className="notification-message">{notification.message}</p>
            </div>
          </div>
          <button
            className="notification-close"
            onClick={handleClose}
            aria-label="Close notification"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add notification method
  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      autoClose: notification.autoClose !== false,
      duration: notification.duration || 5000,
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  // Remove notification method
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Make methods available globally
  useEffect(() => {
    (window as any).notificationSystem = {
      addNotification,
      removeNotification,
      clearAllNotifications,
    };
  }, []);

  // Auto-remove old notifications (keep only last 5)
  useEffect(() => {
    if (notifications.length > 5) {
      setNotifications(prev => prev.slice(-5));
    }
  }, [notifications]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}

// Hook for easy access to notification system
export function useNotifications() {
  return {
    success: (title: string, message: string, options?: Partial<Omit<Notification, "id" | "timestamp" | "type" | "title" | "message">>) => {
      (window as any).notificationSystem?.addNotification({
        type: "success",
        title,
        message,
        ...options,
      });
    },
    error: (title: string, message: string, options?: Partial<Omit<Notification, "id" | "timestamp" | "type" | "title" | "message">>) => {
      (window as any).notificationSystem?.addNotification({
        type: "error",
        title,
        message,
        autoClose: false,
        ...options,
      });
    },
    warning: (title: string, message: string, options?: Partial<Omit<Notification, "id" | "timestamp" | "type" | "title" | "message">>) => {
      (window as any).notificationSystem?.addNotification({
        type: "warning",
        title,
        message,
        ...options,
      });
    },
    info: (title: string, message: string, options?: Partial<Omit<Notification, "id" | "timestamp" | "type" | "title" | "message">>) => {
      (window as any).notificationSystem?.addNotification({
        type: "info",
        title,
        message,
        ...options,
      });
    },
    clear: () => {
      (window as any).notificationSystem?.clearAllNotifications();
    },
  };
}
