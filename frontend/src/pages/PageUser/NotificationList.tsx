import React from "react";
import {
  Bell,
  Pin,
  Paperclip,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";

// Sample data
const notifications = [
  {
    title: "Họp khẩn toàn công ty",
    content:
      "Yêu cầu toàn bộ nhân viên tham dự cuộc họp khẩn vào 14h chiều nay",
    type: "urgent",
    priority: "high",
    status: "open",
    is_pinned: true,
    attachments: [],
  },
  {
    title: "Cập nhật chính sách làm việc",
    content:
      "Thông báo về việc thay đổi chính sách làm việc từ xa từ tháng sau",
    type: "info",
    priority: "medium",
    status: "open",
    is_pinned: true,
    attachments: ["policy.pdf"],
  },
  {
    title: "Bảo trì hệ thống",
    content: "Hệ thống sẽ được bảo trì vào cuối tuần này",
    type: "maintenance",
    priority: "low",
    status: "closed",
    is_pinned: false,
    attachments: [],
  },
];

const NotificationList = () => {
  const getPriorityColor = (priority) => {
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <Bell className="w-5 h-5 text-blue-500" />;
      case "maintenance":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    return status === "open" ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-gray-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-32">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-500" />
              Thông báo công ty
            </h1>
          </div>

          <div className="divide-y divide-gray-200">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="p-6 hover:bg-gray-50 transition-colors duration-200 relative"
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
                      {notification.is_pinned && (
                        <Pin className="w-4 h-4 text-blue-500" />
                      )}
                    </div>

                    <p className="mt-1 text-gray-600">{notification.content}</p>

                    <div className="mt-3 flex items-center gap-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                          notification.priority
                        )}`}
                      >
                        {notification.priority.toUpperCase()}
                      </span>

                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        {getStatusIcon(notification.status)}
                        {notification.status.toUpperCase()}
                      </span>

                      {notification.attachments.length > 0 && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Paperclip className="w-4 h-4" />
                          {notification.attachments.length} tệp đính kèm
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
