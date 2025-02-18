import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  fetchNotifications,
  createNotification,
  setSearchTerm,
  setStatusFilter,
  selectFilteredNotifications,
  selectSearchTerm,
  selectStatusFilter,
  selectNotificationStatus,
  selectNotificationError,
  toggleNotificationStatus,
  updateNotification,
  deleteNotification,
} from "../../redux/slides/notification/notificationsSlice";
import { remove as removeDiacritics } from "diacritics";
import {
  Search,
  Plus,
  AlertCircle,
  Pin,
  FileText,
  X,
  Upload,
  Bell,
  Filter,
  Edit,
  Trash2,
} from "lucide-react";
import { Notification } from "../../redux/slides/notification/notification.types";
interface NotificationFormState {
  title: string;
  content: string;
  type: "internal" | "urgent" | "event" | "policy";
  priority: "low" | "high";
  is_pinned: boolean;
  attachments: File[];
}

type NotificationStatus = "open" | "closed";
const initialFormState: NotificationFormState = {
  title: "",
  content: "",
  type: "internal",
  priority: "low",
  is_pinned: false,
  attachments: [],
};

const MgNotification: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectFilteredNotifications);
  const searchTerm = useAppSelector(selectSearchTerm);
  const statusFilter = useAppSelector(selectStatusFilter);
  const status = useAppSelector(selectNotificationStatus);
  const error = useAppSelector(selectNotificationError);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationFormState | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newNotification, setNewNotification] =
    useState<NotificationFormState>(initialFormState);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotifications());
    }
  }, [status, dispatch]);

  const handleCreateNotification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!newNotification.title?.trim()) {
        throw new Error("Title is required");
      }
      if (!newNotification.content?.trim()) {
        throw new Error("Content is required");
      }
      if (!newNotification.type) {
        throw new Error("Type is required");
      }
      if (!newNotification.priority) {
        throw new Error("Priority is required");
      }

      const formData = new FormData();

      // Append form fields individually
      formData.append("title", newNotification.title.trim());
      formData.append("content", newNotification.content.trim());
      formData.append("type", newNotification.type);
      formData.append("priority", newNotification.priority);
      formData.append("status", "open");
      formData.append("is_pinned", String(newNotification.is_pinned));

      // Handle file attachments
      if (newNotification.attachments?.length > 0) {
        newNotification.attachments.forEach((file) => {
          const normalizedFileName = removeDiacritics(file.name); // Xóa dấu
          const renamedFile = new File([file], normalizedFileName, {
            type: file.type,
          });
          formData.append("files", renamedFile);
        });
      }

      const result = await dispatch(createNotification(formData)).unwrap();
      console.log("Notification created successfully:", result);

      setIsCreateModalOpen(false);
      setNewNotification(initialFormState);
      setIsCreateModalOpen(false);
      setNewNotification(initialFormState);
      dispatch(setSearchTerm("")); // Reset search
      dispatch(setStatusFilter("all")); // Reset filter
      dispatch(fetchNotifications());
    } catch (error: any) {
      console.error("Notification creation failed:", error);
      alert(error.message || "Failed to create notification");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewNotification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewNotification((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewNotification((prev) => ({
        ...prev,
        attachments: Array.from(files),
      }));
    }
  };
  const handleDeleteNotification = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await dispatch(deleteNotification(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete notification:", error);
        alert("Failed to delete notification");
      }
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: "open" | "closed"
  ) => {
    try {
      await dispatch(toggleNotificationStatus({ id, currentStatus })).unwrap();
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Failed to toggle status");
    }
  };

  const handleEditClick = (notification: Notification) => {
    setSelectedNotification({
      title: notification.title,
      content: notification.content,
      type: notification.type as "internal" | "urgent" | "event" | "policy",
      priority: notification.priority as "low" | "high",
      is_pinned: notification.is_pinned,
      attachments: [],
    });
    setEditingId(notification._id);
    setIsEditModalOpen(true);
  };

  const handleUpdateNotification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedNotification || !editingId) return;

    try {
      const formData = new FormData();
      formData.append("title", selectedNotification.title.trim());
      formData.append("content", selectedNotification.content.trim());
      formData.append("type", selectedNotification.type);
      formData.append("priority", selectedNotification.priority);
      formData.append("is_pinned", String(selectedNotification.is_pinned));

      if (selectedNotification.attachments?.length > 0) {
        selectedNotification.attachments.forEach((file) => {
          const normalizedFileName = removeDiacritics(file.name);
          const renamedFile = new File([file], normalizedFileName, {
            type: file.type,
          });
          formData.append("files", renamedFile);
        });
      }

      await dispatch(updateNotification({ id: editingId, formData })).unwrap();
      setIsEditModalOpen(false);
      setSelectedNotification(null);
      setEditingId(null);
    } catch (error: any) {
      console.error("Failed to update notification:", error);
      alert(error.message || "Failed to update notification");
    }
  };

  if (status === "loading") {
    return <div className="text-white">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Search and Create Section */}
        <div className="flex mb-6">
          <div className="relative flex-grow mr-4">
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative min-w-[150px] mr-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                dispatch(
                  setStatusFilter(e.target.value as NotificationStatus | "all")
                )
              }
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <Filter
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="mr-2" /> Create Announcement
          </button>
        </div>

        {/* Statistics */}
        <div className="flex gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Total Announcements: </span>
            <span className="text-white font-bold">{notifications.length}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Urgent: </span>
            <span className="text-white font-bold">
              {notifications.filter((n) => n.type === "urgent").length}
            </span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Pinned: </span>
            <span className="text-white font-bold">
              {notifications.filter((n) => n.is_pinned).length}
            </span>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  {notification.is_pinned && (
                    <Pin className="text-yellow-500" size={20} />
                  )}
                  <h2 className="text-xl font-semibold text-white">
                    {notification.title}
                  </h2>
                  {notification.type === "urgent" && (
                    <span className="px-2 py-1 rounded-full text-xs bg-red-500 text-white">
                      Urgent
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-500 text-white">
                    {notification.priority}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(notification)}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit size={16} className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNotification(notification._id)}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 size={16} className="inline mr-1" /> Delete
                  </button>
                  <button
                    onClick={() =>
                      handleToggleStatus(notification._id, notification.status)
                    }
                    className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
                  >
                    {notification.status.toUpperCase()}
                  </button>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{notification.content}</p>

              <div className="flex items-center text-gray-400 space-x-4">
                <div className="flex items-center">
                  <AlertCircle className="mr-2 text-red-400" size={20} />
                  <span>{notification.type}</span>
                </div>
                <div className="flex items-center">
                  <Bell className="mr-2 text-yellow-400" size={20} />
                  <span>{notification.priority}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-2 text-purple-400" size={20} />
                  <span>
                    {notification.attachments.length > 0
                      ? `${notification.attachments.length} attachments`
                      : "No attachments"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-2xl relative">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">
                Create Announcement
              </h2>

              <form onSubmit={handleCreateNotification} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newNotification.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Content *</label>
                  <textarea
                    name="content"
                    value={newNotification.content}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder="Enter announcement content"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Type</label>
                    <select
                      name="type"
                      value={newNotification.type}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="internal">Internal</option>
                      <option value="urgent">Urgent</option>
                      <option value="event">Event</option>
                      <option value="policy">Policy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={newNotification.priority}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      name="is_pinned"
                      checked={newNotification.is_pinned}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    Pin announcement
                  </label>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Attachments
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full bg-gray-700 text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <Upload className="mr-2" size={20} />
                      Upload Files
                    </label>
                  </div>
                  {newNotification.attachments &&
                    newNotification.attachments.length > 0 && (
                      <div className="mt-2 text-gray-300">
                        Selected files:{" "}
                        {newNotification.attachments
                          .map((file) => file.name)
                          .join(", ")}
                      </div>
                    )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors mt-6"
                >
                  Create Announcement
                </button>
              </form>
            </div>
          </div>
        )}
        {isEditModalOpen && selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-2xl relative">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedNotification(null);
                  setEditingId(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">
                Edit Announcement
              </h2>

              <form onSubmit={handleUpdateNotification} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={selectedNotification.title}
                    onChange={(e) =>
                      setSelectedNotification((prev) => ({
                        ...prev!,
                        title: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Content *</label>
                  <textarea
                    name="content"
                    value={selectedNotification.content}
                    onChange={(e) =>
                      setSelectedNotification((prev) => ({
                        ...prev!,
                        content: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Type</label>
                    <select
                      name="type"
                      value={selectedNotification.type}
                      onChange={(e) =>
                        setSelectedNotification((prev) => ({
                          ...prev!,
                          type: e.target.value as
                            | "internal"
                            | "urgent"
                            | "event"
                            | "policy",
                        }))
                      }
                      className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="internal">Internal</option>
                      <option value="urgent">Urgent</option>
                      <option value="event">Event</option>
                      <option value="policy">Policy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={selectedNotification.priority}
                      onChange={(e) =>
                        setSelectedNotification((prev) => ({
                          ...prev!,
                          priority: e.target.value as "low" | "high",
                        }))
                      }
                      className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      name="is_pinned"
                      checked={selectedNotification.is_pinned}
                      onChange={(e) =>
                        setSelectedNotification((prev) => ({
                          ...prev!,
                          is_pinned: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    Pin announcement
                  </label>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Attachments
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="edit-file-upload"
                      onChange={(e) =>
                        setSelectedNotification((prev) => ({
                          ...prev!,
                          attachments: e.target.files
                            ? Array.from(e.target.files)
                            : [],
                        }))
                      }
                    />
                    <label
                      htmlFor="edit-file-upload"
                      className="flex items-center justify-center w-full bg-gray-700 text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <Upload className="mr-2" size={20} />
                      Upload Files
                    </label>
                  </div>
                  {selectedNotification.attachments?.length > 0 && (
                    <div className="mt-2 text-gray-300">
                      Selected files:{" "}
                      {selectedNotification.attachments
                        .map((file) => file.name)
                        .join(", ")}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors mt-6"
                >
                  Update Announcement
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MgNotification;
