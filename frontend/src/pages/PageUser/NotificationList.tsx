import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  Pin,
  Paperclip,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
interface Notification {
  _id: string;
  title: string;
  content: string;
  type: "urgent" | "info" | "maintenance";
  priority: "high" | "medium" | "low";
  status: "open" | "closed";
  is_pinned: "true" | "false";
  attachments: string[];
  created_at?: string;
  updated_at?: string;
}
const NotificationList: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get<Notification[]>(
          "http://localhost:3000/notifications"
        );
        const filteredAndSortedNotifications = response.data
          .filter((notification) => notification.status === "open")
          .sort((a, b) => {
            if (a.is_pinned === "true" && b.is_pinned === "false") return -1;
            if (a.is_pinned === "false" && b.is_pinned === "true") return 1;
            return 0;
          });
        setNotifications(filteredAndSortedNotifications);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getPriorityColor = (priority: Notification["priority"]): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "urgent":
        return (
          <AlertCircle key={`icon-${type}`} className="w-5 h-5 text-red-500" />
        );
      case "info":
        return <Bell key={`icon-${type}`} className="w-5 h-5 text-blue-500" />;
      case "maintenance":
        return (
          <Clock key={`icon-${type}`} className="w-5 h-5 text-yellow-500" />
        );
      default:
        return <Bell key="icon-default" className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (id: string): void => {
    navigate(`/notification/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-32 flex items-center justify-center">
        <div className="text-gray-600">Đang tải thông báo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-32 flex items-center justify-center">
        <div className="text-red-600">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-32">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-500" />
              Thông báo công ty
            </h1>
          </div>

          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Không có thông báo nào
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={`notification-${notification._id}`}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 relative cursor-pointer"
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-medium text-gray-900 truncate">
                          {notification.title}
                        </h2>
                        {notification.is_pinned === "true" && (
                          <Pin
                            key={`pin-${notification._id}`}
                            className="w-4 h-4 text-blue-500"
                          />
                        )}
                      </div>

                      <p className="mt-1 text-gray-600">
                        {notification.content}
                      </p>

                      <div className="mt-3 flex items-center gap-4">
                        <span
                          key={`priority-${notification._id}`}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                            notification.priority
                          )}`}
                        >
                          {notification.priority.toUpperCase()}
                        </span>

                        <span
                          key={`status-${notification._id}`}
                          className="flex items-center gap-1 text-sm text-gray-500"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          OPEN
                        </span>

                        {notification.attachments.length > 0 && (
                          <span
                            key={`attachments-${notification._id}`}
                            className="flex items-center gap-1 text-sm text-gray-500"
                          >
                            <Paperclip className="w-4 h-4" />
                            {notification.attachments.length} tệp đính kèm
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight
                      key={`chevron-${notification._id}`}
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
