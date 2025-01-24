import { useEffect, useState } from "react";
import {
  FiClock,
  FiUser,
  FiCalendar,
  FiChevronDown,
  FiFilter,
} from "react-icons/fi";

interface User {
  _id: string;
  name: string;
  position: string;
}

interface LeaveRequest {
  _id: string;
  user_id: User;
  date: string;
  reason: string;
  status: "approved" | "pending" | "rejected";
  admin_comment: string | null;
  createdAt: string;
  updatedAt: string;
}

const LeaveRequestList = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    const fetchRequests = async () => {
      const userId = localStorage.getItem("currentUserId");
      try {
        const response = await fetch(
          `http://localhost:3000/leave-requests/user/${userId}`
        );

        if (!response.ok) {
          // Nếu phản hồi không thành công, đặt giá trị rỗng
          console.error(`Failed to fetch leave requests: ${response.status}`);
          setRequests([]);
          setFilteredRequests([]);
          return;
        }

        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []); // Đảm bảo data là mảng
        setFilteredRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setRequests([]);
        setFilteredRequests([]); // Xử lý lỗi, đặt giá trị mặc định
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((req) => req.status === selectedStatus)
      );
    }
  }, [selectedStatus, requests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 mt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Leave Requests
          </h1>
          <p className="text-gray-600">
            Manage and track your leave applications
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-4">
            <FiFilter className="text-gray-400" />
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus("pending")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedStatus("approved")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === "approved"
                  ? "bg-green-100 text-green-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setSelectedStatus("rejected")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {Array.isArray(filteredRequests) && filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No leave requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <FiUser className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.reason}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.user_id.name} • {request.user_id.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" />
                        {formatDate(request.date)}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-2" />
                        {formatTime(request.createdAt)}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full transition-colors">
                      <FiChevronDown />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestList;
