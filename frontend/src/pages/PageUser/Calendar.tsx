import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

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
                ? `${day.date} - Nghỉ: ${day.reason}`
                : `${day.date} - ${day.time}`
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

  const rawData: AttendanceStatus[] = [
    { absent: false, date: "2024-12-30", time: "8:00 - 17:00", reason: "" },
    { absent: true, date: "2025-01-01", time: "", reason: "Bận việc riêng" },
    { absent: false, date: "2025-02-03", time: "8:00 - 17:00", reason: "" },
    { absent: true, date: "2025-10-30", time: "", reason: "Có việc gia đình" },
    { absent: true, date: "2025-10-31", time: "", reason: "Có việc gia đình" },
    { absent: false, date: "2025-11-01", time: "8:00 - 17:00", reason: "" },
    { absent: false, date: "2025-11-02", time: "8:00 - 17:00", reason: "" },
    { absent: true, date: "2025-11-03", time: "", reason: "Ốm" },
    { absent: false, date: "2025-11-04", time: "8:00 - 17:00", reason: "" },
    { absent: true, date: "2025-11-05", time: "", reason: "Đi công tác" },
    { absent: true, date: "2025-09-01", time: "", reason: "Đi công tác" },
    { absent: true, date: "2025-08-01", time: "", reason: "Đi công tác" },
  ];

  const filterDataForMonth = (month: number, year: number) => {
    return rawData.filter((day) => {
      const date = new Date(day.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const updateDataForMultipleMonths = () => {
      const monthsToShow = [];
      for (let i = 0; i <= currentMonth; i++) {
        const monthData = filterDataForMonth(i, currentYear);
        if (monthData.length > 0) {
          monthsToShow.push({ month: i, year: currentYear, days: monthData });
        }
      }
      setMultiMonthData(monthsToShow);
    };

    updateDataForMultipleMonths();

    const intervalId = setInterval(() => {
      const newDate = new Date();
      if (
        newDate.getMonth() !== currentMonth ||
        newDate.getFullYear() !== currentYear
      ) {
        updateDataForMultipleMonths();
      }
    }, 60000);

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
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tên</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ngày</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Lý do</label>
                <textarea className="w-full border rounded px-3 py-2 focus:outline-none" />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
