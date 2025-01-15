import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
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
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ title, days }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 w-[400px] h-[450px] bg-white">
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
      <h2 className="text-xl font-semibold text-center">Tổng lương: 5000$</h2>
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

      // Transform API data to match AttendanceStatus type
      const transformedData: AttendanceStatus[] = data.map((record) => ({
        absent: !record.is_present,
        date: new Date(record.date).toISOString().split("T")[0],
        time: record.is_present ? "8:00 - 17:00" : undefined,
        reason: record.reason || undefined,
      }));

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
    return data.filter((day) => {
      const date = new Date(day.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
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

  return (
    <div className="relative">
      <div className="grid gap-4 p-8 ml-8 mt-[150px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {multiMonthData.map((data, index) => (
          <AttendanceTable
            key={index}
            title={`Tháng ${data.month + 1} / ${data.year}`}
            days={data.days}
          />
        ))}
        <button
          onClick={() => setShowForm(true)}
          className="fixed text-3xl right-3 top-[130px] transform -translate-y-1/2 w-52 h-20 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-700"
        >
          Xin nghỉ phép
        </button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-8 w-[400px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Xin nghỉ phép</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ngày</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 focus:outline-none"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Lý do</label>
                <textarea
                  className="w-full border rounded px-3 py-2 focus:outline-none"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
