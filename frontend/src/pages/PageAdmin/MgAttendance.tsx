import React, { useEffect, useState } from "react";
import {
  FiCheck,
  FiCircle,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiSave,
} from "react-icons/fi";
import { XMarkIcon } from "@heroicons/react/24/solid";

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

export default function MgAttendance() {
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [rollcall, setRollcall] = useState<Rollcall[]>([]);
  const closeModal = () => setShowForm(false);

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
    console.log(payload);
    try {
      const response = await fetch(
        "http://localhost:3000/attendance-forms/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

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
    } catch (error) {
      console.error("Error saving attendance form:", error);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      <div className="w-full mb-4 flex items-center top-0 left-3 absolute">
        <div className="relative w-[700px] flex">
          <input
            type="text"
            placeholder="Tìm kiếm tên nhân viên..."
            className="w-full border rounded-xl px-3 py-2 pl-10 focus:outline-none text-gray-900"
          />
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-700 ml-4 w-40 rounded-xl">
            Search
          </button>
        </div>
      </div>
      <div className="grid gap-52 p-8 mt-[80px] md:grid-cols-1 lg:grid-cols-2">
        <button
          onClick={() => setShowForm(true)}
          className="fixed text-xl right-10 top-[130px] transform -translate-y-1/2 w-52 h-11 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-700"
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
            {rollcall.map((attendance) => {
              // Đếm số lượng có mặt và vắng mặt
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
                    <FiEye className="text-blue-500 cursor-pointer" />
                    <FiEdit className="text-yellow-500 cursor-pointer" />
                    <FiTrash2 className="text-red-500 cursor-pointer" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-8 w-[80%] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Ngày điểm danh:</span>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSaveForm}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <FiSave className="w-5 h-5" />
                  Lưu điểm danh
                </button>
              </div>

              {/* Attendance Table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 border text-left text-gray-600">
                      Nhân viên
                    </th>
                    <th className="px-4 py-2 border text-center text-gray-600">
                      Điểm danh
                    </th>
                    <th className="px-4 py-2 border text-center text-gray-600">
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-gray-600">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 transition-colors cursor-pointer"
                          onChange={(e) => {
                            const isPresent = e.target.checked; // Trạng thái của checkbox
                            setAttendanceData((prev) => {
                              // Cập nhật trạng thái is_present cho người dùng hiện tại
                              const updatedAttendance = prev.some(
                                (item) => item.user_id === user._id
                              )
                                ? prev.map((item) =>
                                    item.user_id === user._id
                                      ? { ...item, is_present: isPresent } // Cập nhật is_present
                                      : item
                                  )
                                : [
                                    ...prev,
                                    {
                                      user_id: user._id,
                                      is_present: isPresent, // Nếu checkbox tích thì là true, không tích thì false
                                      reason: null, // Mặc định là null nếu không nhập lý do
                                    },
                                  ];

                              // Đảm bảo tất cả người dùng đều có mặt trong attendanceData
                              const allUsersAttendance = users.reduce(
                                (acc, user) => {
                                  // Kiểm tra nếu người dùng chưa có trong attendanceData thì thêm vào với is_present = false và reason = null
                                  const userAttendance = updatedAttendance.find(
                                    (item) => item.user_id === user._id
                                  );

                                  if (!userAttendance) {
                                    acc.push({
                                      user_id: user._id,
                                      is_present: false, // Nếu không tích checkbox thì là false
                                      reason: null, // Nếu không nhập lý do thì là null
                                    });
                                  }
                                  return acc;
                                },
                                updatedAttendance
                              );

                              return allUsersAttendance; // Trả về danh sách đã cập nhật
                            });
                          }}
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        <textarea
                          className="w-full min-h-[40px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          placeholder="Nhập ghi chú..."
                          onChange={(e) => {
                            const reason = e.target.value;
                            setAttendanceData((prev) => {
                              // Cập nhật lý do cho người dùng hiện tại
                              const updatedAttendance = prev.some(
                                (item) => item.user_id === user._id
                              )
                                ? prev.map((item) =>
                                    item.user_id === user._id
                                      ? { ...item, reason } // Cập nhật lý do
                                      : item
                                  )
                                : [
                                    ...prev,
                                    {
                                      user_id: user._id,
                                      is_present: false, // Mặc định là false nếu không tích checkbox
                                      reason: reason || null, // Nếu không nhập lý do thì là null
                                    },
                                  ];

                              // Đảm bảo tất cả người dùng đều có mặt trong attendanceData
                              const allUsersAttendance = users.map((user) => {
                                // Kiểm tra nếu người dùng chưa có trong attendanceData thì thêm vào với is_present = false và reason = null
                                if (
                                  !updatedAttendance.some(
                                    (item) => item.user_id === user._id
                                  )
                                ) {
                                  updatedAttendance.push({
                                    user_id: user._id,
                                    is_present: false, // Nếu không tích checkbox thì là false
                                    reason: null, // Nếu không nhập lý do thì là null
                                  });
                                }
                                return updatedAttendance;
                              });

                              return allUsersAttendance.flat(); // Trả về danh sách đã cập nhật, loại bỏ trùng lặp
                            });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
