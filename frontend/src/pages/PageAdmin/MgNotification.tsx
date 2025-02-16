import { useState } from "react";
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

const MgNotification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative min-w-[150px] mr-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
            <span className="text-white font-bold">12</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Urgent: </span>
            <span className="text-white font-bold">3</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Pinned: </span>
            <span className="text-white font-bold">2</span>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {/* Sample Announcement Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <Pin className="text-yellow-500" size={20} />
                <h2 className="text-xl font-semibold text-white">
                  Họp khẩn toàn công ty
                </h2>
                <span className="px-2 py-1 rounded-full text-xs bg-red-500 text-white">
                  Urgent
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-yellow-500 text-white">
                  High Priority
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit size={16} className="inline mr-1" /> Edit
                </button>
                <button className="px-3 py-1 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 size={16} className="inline mr-1" /> Delete
                </button>
                <button className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 hover:bg-green-700 text-white">
                  OPEN
                </button>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              Yêu cầu toàn bộ nhân viên tham dự cuộc họp khẩn vào 14h chiều nay
            </p>

            <div className="flex items-center text-gray-400 space-x-4">
              <div className="flex items-center">
                <AlertCircle className="mr-2 text-red-400" size={20} />
                <span>Urgent</span>
              </div>
              <div className="flex items-center">
                <Bell className="mr-2 text-yellow-400" size={20} />
                <span>High Priority</span>
              </div>
              <div className="flex items-center">
                <FileText className="mr-2 text-purple-400" size={20} />
                <span>No attachments</span>
              </div>
            </div>
          </div>
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

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter announcement title"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Content *</label>
                  <textarea
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder="Enter announcement content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Type</label>
                    <select className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Priority</label>
                    <select className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-gray-300">
                    <input type="checkbox" className="mr-2" />
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
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full bg-gray-700 text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <Upload className="mr-2" size={20} />
                      Upload Files
                    </label>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors mt-6">
                  Create Announcement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MgNotification;
