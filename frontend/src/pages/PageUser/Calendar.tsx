import { CalculatorIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

type AttendanceRecord = {
  _id: string;
  user_id: string;
  date: string;
  is_present: boolean;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
};

type AttendanceStatus = {
  absent: boolean;
  date: string;
  time?: string;
  reason?: string;
};

interface AttendanceTableProps {
  title: string;
  days: AttendanceStatus[];
  month: string;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  title,
  days,
  month,
}) => {
  const [salary, setSalary] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("currentUserId");
  const [error, setError] = useState<string | null>(null);
  const fetchSalary = async () => {
    try {
      // Gọi API để lấy lương
      const response = await fetch(
        `http://localhost:3000/payrolls/by-month?user_id=${userId}&month=${month}`
      );
      const data = await response.json();
      setSalary(data.total_salary);
    } catch (error) {
      console.error("Error fetching salary:", error);
    }
  };

  const generateSalary = async () => {
    setIsLoading(true);
    try {
      // Gọi API để tính lương
      await fetch(
        `http://localhost:3000/payrolls/generate?user_id=${userId}&month=${month}`,
        {
          method: "POST",
        }
      );
      // Sau khi tính lương xong, fetch lại số lương mới
      await fetchSalary();
    } catch (error) {
      console.error("Error generating salary:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="border rounded-lg shadow-md p-4 w-[400px] h-auto bg-white">
      <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>
      <div className="grid grid-rows-6 grid-cols-6 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-12 h-12 border rounded-md bg-gray-100 relative group"
            data-tooltip-id={`tooltip-${index}`}
            data-tooltip-content={
              day.absent
                ? `${day.date} - Nghỉ: ${day.reason || "Không có lý do"}`
                : `${day.date} - ${day.time || "8:00 - 17:00"}`
            }
          >
            {day.absent ? (
              <XMarkIcon className="w-6 h-6 text-red-500" />
            ) : (
              <CheckIcon className="w-6 h-6 text-green-500" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-4">
        <button
          onClick={generateSalary}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
        >
          <CalculatorIcon className="w-5 h-5" />
          {isLoading ? "Đang tính..." : "Tính lương"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {salary !== null && (
          <div className="text-xl font-semibold text-center">
            Tổng lương: {salary.toLocaleString()}đ
          </div>
        )}
      </div>

      {days.map((_, index) => (
        <Tooltip key={index} id={`tooltip-${index}`} />
      ))}
    </div>
  );
};

export default function Calendar() {
  const [multiMonthData, setMultiMonthData] = useState<
    { month: number; year: number; days: AttendanceStatus[] }[]
  >([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchAttendanceData = async () => {
    try {
      const userId = localStorage.getItem("currentUserId");
      const year = new Date().getFullYear();
      const response = await fetch(
        `http://localhost:3000/attendance-records/user-attendance-details-in-year?user_id=${userId}&year=${year}`
      );
      const data: AttendanceRecord[] = await response.json();

      // Chuyển đổi dữ liệu API thành kiểu AttendanceStatus
      const transformedData: AttendanceStatus[] = data.map((record) => ({
        absent: !record.is_present,
        date: new Date(record.date).toISOString().split("T")[0], // Chuyển sang định dạng yyyy-mm-dd
        time: record.is_present ? "8:00 - 17:00" : undefined,
        reason: record.reason || undefined,
      }));

      // Sắp xếp các ngày theo thứ tự tăng dần
      transformedData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return transformedData;
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      return [];
    }
  };

  const filterDataForMonth = (
    data: AttendanceStatus[],
    month: number,
    year: number
  ) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate(); // Ngày hiện tại

    // Tạo một mảng chứa các ngày từ 1 đến ngày hiện tại
    const daysInMonth = Array.from({ length: currentDay }, (_, i) => i + 2); // [1, 2, 3, ..., currentDay]

    // Tạo dữ liệu cho mỗi ngày trong tháng
    const result: AttendanceStatus[] = daysInMonth.map((day) => {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split("T")[0]; // Format: yyyy-mm-dd
      const attendanceData = data.find((d) => d.date === dateString);

      return {
        absent: attendanceData ? attendanceData.absent : true, // Nếu không có dữ liệu thì coi như vắng mặt
        date: dateString,
        time: attendanceData ? attendanceData.time : undefined,
        reason: attendanceData ? attendanceData.reason : undefined,
      };
    });

    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem("currentUserId");
      const response = await fetch("http://localhost:3000/leave-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          date: formData.date,
          reason: formData.reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit leave request");
      }

      // Reset form and close modal
      setFormData({ date: "", reason: "" });
      setShowForm(false);

      // Refresh attendance data
      const attendanceData = await fetchAttendanceData();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const monthsToShow = [];
      for (let i = 0; i <= currentMonth; i++) {
        const monthData = filterDataForMonth(attendanceData, i, currentYear);
        if (monthData.length > 0) {
          monthsToShow.push({ month: i, year: currentYear, days: monthData });
        }
      }
      setMultiMonthData(monthsToShow);

      alert("Đã gửi đơn xin nghỉ phép thành công!");
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Có lỗi xảy ra khi gửi đơn xin nghỉ phép!");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const loadAttendanceData = async () => {
      const attendanceData = await fetchAttendanceData();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const monthsToShow = [];
      for (let i = 0; i <= currentMonth; i++) {
        const monthData = filterDataForMonth(attendanceData, i, currentYear);
        if (monthData.length > 0) {
          monthsToShow.push({ month: i, year: currentYear, days: monthData });
        }
      }
      setMultiMonthData(monthsToShow);
    };

    loadAttendanceData();

    const intervalId = setInterval(loadAttendanceData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const closeModal = () => setShowForm(false);
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header Actions */}
      <div className="fixed right-8 top-[130px] flex gap-4 z-10">
        <button
          onClick={() => navigate("/leave-request")}
          className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Lịch sử nghỉ phép
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Xin nghỉ phép
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="container mx-auto px-4">
        <div className="grid gap-6 p-8 mt-[150px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {multiMonthData.map((data, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <AttendanceTable
                title={`Tháng ${data.month + 1} / ${data.year}`}
                days={data.days}
                month={`${data.year}-${String(data.month + 1).padStart(
                  2,
                  "0"
                )}`} // Format: YYYY-MM
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-8 w-[450px] relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Xin nghỉ phép
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Ngày nghỉ
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]} // Ngày hiện tại theo định dạng YYYY-MM-DD
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Lý do nghỉ
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                  placeholder="Vui lòng nhập lý do nghỉ..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
