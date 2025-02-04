import { CalculatorIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useNotification } from "../../components/user/Notification";

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

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const isDateInPast = (date: string) => {
  const today = new Date();
  const compareDate = new Date(date);
  // Set both dates to midnight for accurate comparison
  today.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate <= today; // Changed to <= to include current date
};
// const filterDataForMonth = (
//   data: AttendanceStatus[],
//   month: number,
//   year: number
// ) => {
//   const daysInMonth = getDaysInMonth(month, year);
//   const monthStr = String(month + 1).padStart(2, "0");
//   const yearStr = String(year);

//   // Create an array for all days in the month
//   const monthDays: AttendanceStatus[] = [];

//   for (let day = 1; day <= daysInMonth; day++) {
//     const dateStr = `${yearStr}-${monthStr}-${String(day).padStart(2, "0")}`;
//     const foundDay = data.find((d) => d.date === dateStr);
//     const isPastDate = isDateInPast(dateStr);

//     monthDays.push({
//       absent: foundDay ? foundDay.absent : isPastDate ? true : false,
//       date: dateStr,
//       time: foundDay?.time,
//       reason:
//         isPastDate && !foundDay ? "Nghỉ không có lý do" : foundDay?.reason,
//     });
//   }

//   return monthDays;
// };
const AttendanceTable: React.FC<AttendanceTableProps> = ({
  title,
  days,
  month,
}) => {
  const [salary, setSalary] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("currentUserId");
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  // Parse month string to get month and year
  const [year, monthStr] = month.split("-");
  const monthNum = parseInt(monthStr) - 1;
  const daysInMonth = getDaysInMonth(monthNum, parseInt(year));
  const firstDayOfMonth = new Date(parseInt(year), monthNum, 1).getDay();
  // Create array of all days in month
  const allDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateString = `${year}-${monthStr}-${String(day).padStart(2, "0")}`;
    const existingDay = days.find((d) => d.date === dateString);
    const isPastDate = isDateInPast(dateString);

    return {
      absent: existingDay ? existingDay.absent : isPastDate ? true : false,
      date: dateString,
      time: existingDay?.time,
      reason:
        isPastDate && !existingDay
          ? "Nghỉ không có lý do"
          : existingDay?.reason,
      isCurrentMonth: true,
      isPastDate,
    };
  });

  // Get day names for calendar header
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const totalDays = firstDayOfMonth + daysInMonth;
  const totalWeeks = Math.ceil(totalDays / 7);
  const totalCells = totalWeeks * 7;
  const remainingCells = totalCells - (firstDayOfMonth + daysInMonth);

  // Create calendar grid with proper padding
  const calendarGrid = [
    ...Array(firstDayOfMonth).fill(null),
    ...allDays,
    ...Array(remainingCells).fill(null),
  ];

  const fetchSalary = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/payrolls/by-month?user_id=${userId}&month=${month}`
      );
      const data = await response.json();
      setSalary(data.total_salary);
    } catch (error) {
      console.error("Error fetching salary:", error);
      setError("Không thể tải thông tin lương");
    }
  };

  const generateSalary = async () => {
    setIsLoading(true);
    try {
      await fetch(
        `http://localhost:3000/payrolls/generate?user_id=${userId}&month=${month}`,
        {
          method: "POST",
        }
      );
      await fetchSalary();
      showNotification("success", "Tính lương thành công!");
    } catch (error) {
      console.error("Error generating salary:", error);
      showNotification("error", "Có lỗi xảy ra khi tính lương!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-6 w-full bg-white">
      <h2 className="text-xl font-semibold text-center mb-6">{title}</h2>

      {/* Calendar header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarGrid.map((day, index) => (
          <div key={index} className="aspect-square">
            {day && (
              <div
                className={`w-full h-full flex flex-col items-center justify-center border rounded-md relative group hover:bg-gray-100 transition-colors ${
                  !day.isPastDate ? "bg-white" : "bg-gray-50"
                }`}
                data-tooltip-id={`tooltip-${index}`}
                data-tooltip-content={
                  day.isPastDate
                    ? day.absent
                      ? `${day.date} - Nghỉ: ${day.reason || "Không có lý do"}`
                      : `${day.date} - ${day.time || "8:00 - 17:00"}`
                    : `${day.date} - Chưa đến ngày`
                }
              >
                <span className="text-xs text-gray-600 mb-1">
                  {new Date(day.date).getDate()}
                </span>
                {day.isPastDate ? (
                  day.absent ? (
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  )
                ) : (
                  <span className="w-5 h-5" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
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

      {calendarGrid.map((_, index) => (
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
  const { showNotification } = useNotification();
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

      const transformedData: AttendanceStatus[] = data.map((record) => ({
        absent: !record.is_present,
        date: new Date(record.date).toISOString().split("T")[0],
        time: record.is_present ? "8:00 - 17:00" : undefined,
        reason: record.reason || undefined,
      }));

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
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
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

      setFormData({ date: "", reason: "" });
      setShowForm(false);

      const attendanceData = await fetchAttendanceData();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const monthsToShow = [];
      for (let i = 0; i <= currentMonth; i++) {
        const monthData = filterDataForMonth(attendanceData, i, currentYear);
        monthsToShow.push({ month: i, year: currentYear, days: monthData });
      }
      setMultiMonthData(monthsToShow);
      showNotification("success", "Đơn đã gửi thành công!");
    } catch (error) {
      showNotification("error", "Đơn gửi thất bại!");
      console.error("Error:", error);
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
        monthsToShow.push({ month: i, year: currentYear, days: monthData });
      }
      setMultiMonthData(monthsToShow);
    };

    loadAttendanceData();

    const intervalId = setInterval(loadAttendanceData, 60000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, []);

  const closeModal = () => setShowForm(false);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gray-50">
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
                )}`}
              />
            </div>
          ))}
        </div>
      </div>

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
                  min={new Date().toISOString().split("T")[0]}
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
