import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, AlertTriangle, X } from "lucide-react";

// Types
type NotificationType = "error" | "warning" | "success";

interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

// Context để quản lý notifications
import { createContext, useContext } from "react";

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Component hiển thị một notification
const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
  };

  const backgrounds = {
    error: "bg-red-50 dark:bg-red-900/30",
    warning: "bg-yellow-50 dark:bg-yellow-900/30",
    success: "bg-green-50 dark:bg-green-900/30",
  };

  return (
    <div
      className={`
        ${isLeaving ? "animate-slide-out" : "animate-slide-in"}
        fixed top-4 right-4 w-100 max-w-[calc(100%-2rem)]
        ${backgrounds[type]} 
        rounded-lg shadow-lg
      `}
    >
      <div className="flex p-4 items-center gap-3">
        {icons[type]}
        <p className="flex-1 text-sm text-gray-900 dark:text-gray-100">
          {message}
        </p>
        <button
          onClick={() => {
            setIsLeaving(true);
            setTimeout(() => onClose(id), 300);
          }}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Provider để quản lý các notifications
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: NotificationType;
      message: string;
    }>
  >([]);

  const showNotification = (type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Hook để sử dụng notification
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export default Notification;
