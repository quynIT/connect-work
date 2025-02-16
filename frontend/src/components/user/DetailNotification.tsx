import {
  Bell,
  Pin,
  Paperclip,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Calendar,
  User,
  Eye,
  MessageSquare,
  Download,
} from "lucide-react";
import { useState } from "react";

const NotificationDetail = () => {
  // Sample notification data
  const notification = {
    title: "Họp khẩn toàn công ty",
    content:
      "Yêu cầu toàn bộ nhân viên tham dự cuộc họp khẩn vào 14h chiều nay. Nội dung cuộc họp sẽ bao gồm:\n\n1. Cập nhật tình hình kinh doanh Q1/2024\n2. Thông báo kế hoạch tái cấu trúc công ty\n3. Thảo luận về chiến lược phát triển mới\n\nĐịa điểm: Phòng họp tầng 15\nThời gian: 14:00 - 16:00\nHình thức: Trực tiếp kết hợp online qua Zoom\n\nLưu ý: Đây là cuộc họp bắt buộc, vui lòng sắp xếp thời gian tham dự đầy đủ.",
    type: "urgent",
    priority: "high",
    status: "open",
    is_pinned: true,
    created_at: "2024-02-16T08:00:00Z",
    created_by: "Nguyễn Văn A",
    department: "Ban Giám đốc",
    views: 145,
    comments: [
      {
        user: "Trần Thị B",
        content: "Tôi sẽ tham dự online vì đang công tác tại chi nhánh HCM",
        time: "2 giờ trước",
      },
      {
        user: "Lê Văn C",
        content: "Đã nhận thông tin, sẽ có mặt đúng giờ",
        time: "30 phút trước",
      },
    ],
    attachments: [
      {
        name: "agenda.pdf",
        size: "2.4 MB",
        type: "PDF",
      },
      {
        name: "presentation.pptx",
        size: "5.1 MB",
        type: "PPTX",
      },
    ],
  };

  const [showCommentInput, setShowCommentInput] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-32">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getTypeIcon(notification.type)}
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {notification.title}
                  </h1>
                  {notification.is_pinned && (
                    <Pin className="w-5 h-5 text-blue-500" />
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(notification.created_at).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {notification.created_by}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {notification.views} lượt xem
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    notification.priority
                  )}`}
                >
                  {notification.priority.toUpperCase()}
                </span>
                {notification.status === "open" ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    OPEN
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <XCircle className="w-4 h-4 mr-1" />
                    CLOSED
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="prose max-w-none">
              {notification.content.split("\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-4 text-gray-700 whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Attachments */}
          {notification.attachments.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Tệp đính kèm ({notification.attachments.length})
              </h3>
              <div className="space-y-2">
                {notification.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center">
                      <Paperclip className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <Download className="w-4 h-4 mr-1" />
                      Tải xuống
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
