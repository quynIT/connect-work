import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiEye, FiSave } from "react-icons/fi";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
interface User {
  _id: string;
  name: string;
}
interface Employee {
  user_id: string;
  is_present: boolean;
  reason: string | null;
  _id: string;
}
interface Rollcall {
  _id: string;
  date: Date;
  employees: Employee[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
interface Attendance {
  user_id: string;
  is_present: boolean;
  reason: string | null;
}
type LeaveRequest = {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    position: string;
  };
  date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  admin_comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function MgAttendance() {
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchDate, setSearchDate] = useState("");
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [rollcall, setRollcall] = useState<Rollcall[]>([]);
  const closeModal = () => setShowForm(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveCount, setLeaveCount] = useState(0);
  const [showLeaveRequests, setShowLeaveRequests] = useState(false);
  const itemsPerPage = 8;
  // Fetch user list on component mount
  useEffect(() => {
    fetch("http://localhost:3000/user/list")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);
  useEffect(() => {
    fetch("http://localhost:3000/attendance-forms/all")
      .then((res) => res.json())
      .then((data) => setRollcall(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);
  // Save attendance form
  const handleSaveForm = async () => {
    // Kiểm tra xem formDate có hợp lệ không
    if (!formDate || isNaN(new Date(formDate).getTime())) {
      alert("Ngày điểm danh không hợp lệ!");
      return;
    }

    const payload = {
      date: new Date(formDate).toISOString(), // Chắc chắn formDate hợp lệ
      employees: attendanceData.map((item) => ({
        user_id: item.user_id,
        is_present: item.is_present,
        reason: item.reason || null,
      })),
    };

    try {
      const response = await fetch(
        "http://localhost:3000/attendance-forms/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      // Kiểm tra nếu response trả về lỗi
      if (!response.ok) {
        const errorData = await response.json(); // Lấy thông tin lỗi từ server
        throw new Error(
          errorData.message || "Có lỗi xảy ra khi tạo form điểm danh"
        );
      }

      const data = await response.json();
      if (data && data._id) {
        // Lưu form ID vào attendance records API
        await fetch("http://localhost:3000/attendance-records/from-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form_id: data._id }),
        });

        alert("Form đã được lưu thành công!");
      }
    } catch (error: any) {
      // Xử lý lỗi trả về từ server hoặc lỗi khác
      console.error("Error saving attendance form:", error);
      alert(`Lỗi: ${error.message}`); // Hiển thị thông báo lỗi cho người dùng
    }
  };

  const updateAttendance = (
    userId: string,
    key: keyof Attendance,
    value: string | boolean | null
  ) => {
    setAttendanceData((prev) => {
      // Tạo danh sách mới bao gồm tất cả user từ `users`
      const allUsersAttendance = users.map((user) => {
        const existingData = prev.find((item) => item.user_id === user._id);

        if (user._id === userId) {
          // Cập nhật giá trị key nếu là user hiện tại
          return {
            user_id: user._id,
            is_present:
              key === "is_present"
                ? !!value
                : existingData?.is_present || false, // Chuyển về boolean
            reason:
              key === "reason"
                ? (value as string) || null
                : existingData?.reason || null, // Chuyển về string | null
          };
        }

        // Trả về dữ liệu cũ nếu đã tồn tại, hoặc tạo mới với mặc định
        return (
          existingData || {
            user_id: user._id,
            is_present: false, // Mặc định là false
            reason: null, // Mặc định là null
          }
        );
      });

      return allUsersAttendance;
    });
  };

  //Phan trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRollcall = rollcall.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rollcall.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const navigate = useNavigate();

  const handleViewAttendance = (formId: string) => {
    navigate(`/admin/view-attendance/${formId}`);
  };
  const handleEditAttendance = (formId: string) => {
    navigate(`/admin/edit-attendance/${formId}`);
  };
  const handleFormDateChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedDate = e.target.value;
    setFormDate(selectedDate);

    if (!selectedDate || isNaN(new Date(selectedDate).getTime())) {
      setLeaveRequests([]);
      setLeaveCount(0);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/leave-requests?date=${selectedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data); // Lưu danh sách vào state
        setLeaveCount(data.length); // Cập nhật số lượng
      } else {
        setLeaveRequests([]);
        setLeaveCount(0);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setLeaveRequests([]);
      setLeaveCount(0);
    }
  };

  const handleSearchByDate = async () => {
    if (!searchDate || isNaN(new Date(searchDate).getTime())) {
      alert("Ngày tìm kiếm không hợp lệ!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/attendance-forms/search-by-date?date=${searchDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setRollcall(data);
      } else {
        alert("Không tìm thấy dữ liệu cho ngày này.");
      }
    } catch (error) {
      console.error("Error searching attendance by date:", error);
    }
  };
  const handleDeleteAttendance = async (formId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa form này không?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/attendance-forms/delete/${formId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Cập nhật danh sách rollcall sau khi xóa
          setRollcall((prev) => prev.filter((item) => item._id !== formId));
          alert("Xóa form thành công!");
        } else {
          console.error("Lỗi khi xóa form:", response.statusText);
          alert("Không thể xóa form. Vui lòng thử lại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa form:", error);
        alert("Đã xảy ra lỗi khi xóa form.");
      }
    }
  };
  const updateLeaveRequestStatus = async (
    requestId: string,
    newStatus: "pending" | "approved" | "rejected"
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/leave-requests/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setLeaveRequests((prev) =>
          prev.map((req) =>
            req._id === requestId ? { ...req, status: newStatus } : req
          )
        );
        alert(`Cập nhật trạng thái thành công: ${newStatus}`);
      } else {
        alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error updating leave request status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-yellow-500" />;
    }
  };
  return (
    <div className="relative flex flex-col justify-center items-center">
      {/* Thanh tìm kiếm */}
      <div className="w-full flex items-center absolute top-5 left-1/2 transform -translate-x-1/2">
        <div className="relative w-[700px] flex items-center">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 focus:outline-none text-gray-900"
          />
          <button
            onClick={handleSearchByDate}
            className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-700 ml-4 rounded-xl"
          >
            Search
          </button>
        </div>
      </div>

      {/* Nút tạo form điểm danh */}
      <div className="flex items-center justify-center mt-32">
        <button
          onClick={() => setShowForm(true)}
          className="absolute text-xl right-10 top-5 w-52 h-11 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-700"
        >
          Tạo form điểm danh
        </button>
      </div>
      <div className="w-full right-0 absolute top-20">
        <table className="w-full bg-[rgb(23,24,33)] rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Người tạo
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Ngày điểm danh
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">
                Có mặt
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">
                Vắng mặt
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRollcall.map((attendance) => {
              const presentCount = attendance.employees.filter(
                (emp) => emp.is_present
              ).length;
              const absentCount = attendance.employees.filter(
                (emp) => !emp.is_present
              ).length;

              return (
                <tr
                  key={attendance._id}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="px-4 py-3 text-sm text-gray-200">Admin</td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {attendance.date}
                  </td>
                  <td className="px-4 py-3 text-center">{presentCount}</td>
                  <td className="px-4 py-3 text-center">{absentCount}</td>

                  <td className="px-4 py-3 text-center flex justify-center gap-3">
                    <FiEye
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleViewAttendance(attendance._id)} // Gọi hàm điều hướng với form id
                    />
                    <FiEdit
                      className="text-yellow-500 cursor-pointer"
                      onClick={() => handleEditAttendance(attendance._id)}
                    />
                    <FiTrash2
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteAttendance(attendance._id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 mx-1 border rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-6 w-[85%] max-h-[90vh] overflow-hidden relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="p-4">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium">
                      Ngày điểm danh:
                    </span>
                    <input
                      type="date"
                      value={formDate}
                      onChange={handleFormDateChange}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50 hover:bg-white transition-colors duration-200"
                      // Giới hạn ngày tối đa là ngày hiện tại và mặc định là ngày hiện tại
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {leaveCount > 0 && (
                    <div
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                      onClick={() => setShowLeaveRequests(true)}
                    >
                      <span className="font-medium">{leaveCount}</span>
                      <span>người xin phép</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSaveForm}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <FiSave className="w-5 h-5" />
                  Lưu điểm danh
                </button>
              </div>

              {/* Attendance Table */}
              <div className="overflow-y-auto max-h-[60vh] rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 border-r text-left text-gray-700 font-semibold tracking-wider">
                        Nhân viên
                      </th>
                      <th className="px-6 py-3 border-r text-center text-gray-700 font-semibold tracking-wider w-32">
                        Điểm danh
                      </th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold tracking-wider">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 border-r text-gray-700 font-medium">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 border-r text-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer"
                            onChange={(e) =>
                              updateAttendance(
                                user._id,
                                "is_present",
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            className="w-full min-h-[40px] p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400 bg-gray-50 hover:bg-white transition-colors duration-200"
                            placeholder="Nhập ghi chú..."
                            onChange={(e) =>
                              updateAttendance(
                                user._id,
                                "reason",
                                e.target.value || null
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {showLeaveRequests && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
          onClick={() => setShowLeaveRequests(false)}
        >
          <div
            className="bg-white rounded-lg p-8 w-[80%] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Danh sách xin phép vắng ngày {formDate}
            </h3>
            <ul className="space-y-4">
              {leaveRequests.map((req) => (
                <li
                  key={req._id}
                  className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(req.status)}
                      <div>
                        <span className="font-medium text-gray-800">
                          {req.user_id.name}
                        </span>
                        <span className="text-gray-600">
                          {" "}
                          ({req.user_id.position})
                        </span>
                        <p className="text-gray-600 mt-1">{req.reason}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {req.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateLeaveRequestStatus(req._id, "approved")
                            }
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                            Approved
                          </button>
                          <button
                            onClick={() =>
                              updateLeaveRequestStatus(req._id, "rejected")
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                          >
                            <XCircleIcon className="w-5 h-5" />
                            Rejected
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowLeaveRequests(false)}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 w-full sm:w-auto"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
