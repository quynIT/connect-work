import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Bell,
  Pin,
  Paperclip,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Eye,
  Download,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  fetchNotificationDetail,
  selectCurrentNotification,
  selectNotificationDetailStatus,
  selectNotificationDetailError,
} from "../../redux/slides/notification/notificationsSlice";

const NotificationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const notification = useAppSelector(selectCurrentNotification);
  const status = useAppSelector(selectNotificationDetailStatus);
  const error = useAppSelector(selectNotificationDetailError);

  useEffect(() => {
    if (id) {
      dispatch(fetchNotificationDetail(id));
    }
  }, [dispatch, id]);

  const getPriorityColor = (priority: "high" | "low"): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: "urgent" | "info" | "maintenance") => {
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
  const handleFilePreview = (fileUrl: string) => {
    const fileId = fileUrl.match(/id=(.*?)(&|$)/)?.[1];
    if (fileId) {
      const viewerUrl = `https://drive.google.com/file/d/${fileId}/view`;
      window.open(viewerUrl, "_blank");
    }
  };

  const handleFileDownload = (fileUrl: string) => {
    if (!fileUrl) {
      console.error("No file URL provided");
      return;
    }

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = ""; // This will use the server's filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-32 flex items-center justify-center">
        <div className="text-gray-600">Đang tải thông báo...</div>
      </div>
    );
  }
  const renderAttachments = () => {
    const attachments = notification?.attachments;
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Tệp đính kèm ({attachments.length})
        </h3>
        <div className="space-y-2">
          {attachments.map((attachment, index) => {
            const attachmentUrl =
              typeof attachment === "string" ? attachment : attachment.path;
            const attachmentName =
              typeof attachment === "string"
                ? `Tệp đính kèm ${index + 1}`
                : attachment.filename || `Tệp đính kèm ${index + 1}`;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center">
                  <Paperclip className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {attachmentName}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => handleFilePreview(attachmentUrl)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem
                  </button>
                  <button
                    onClick={() => handleFileDownload(attachmentUrl)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Tải xuống
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-32 flex items-center justify-center">
        <div className="text-red-600">Lỗi: {error}</div>
      </div>
    );
  }

  if (!notification) {
    return null;
  }

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
                  {notification.is_pinned === "true" && (
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
          {renderAttachments()}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
