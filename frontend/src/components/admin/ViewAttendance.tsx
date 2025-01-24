import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { useParams } from "react-router-dom";

interface Employee {
  user_id: {
    _id: string;
    name: string;
  };
  is_present: boolean;
  reason: string | null;
  _id: string;
}

interface AttendanceData {
  _id: string;
  date: string;
  employees: Employee[];
  createdAt: string;
  updatedAt: string;
}

const ViewAttendance = () => {
  const { id } = useParams();
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/attendance-forms/detail/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-blue-400 text-xl">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );

  return (
    <div className="p-8 w-full max-w-6xl mx-auto bg-gray-900 shadow-2xl rounded-xl">
      <div className="mb-8 flex items-center gap-4">
        <label className="text-blue-400 text-lg font-semibold">
          Ngày điểm danh:
        </label>
        <div className="relative">
          <input
            type="date"
            className="pl-4 pr-10 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg text-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            value={
              attendanceData
                ? new Date(attendanceData.date).toISOString().split("T")[0]
                : ""
            }
            readOnly
          />
          <FaCalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-lg" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full border-collapse bg-gray-900">
          <thead>
            <tr className="bg-gray-800">
              <th className="border-b border-gray-700 px-6 py-4 text-left text-lg font-semibold text-blue-400">
                Nhân viên
              </th>
              <th className="border-b border-gray-700 px-6 py-4 text-center text-lg font-semibold text-blue-400">
                Có mặt
              </th>
              <th className="border-b border-gray-700 px-6 py-4 text-center text-lg font-semibold text-blue-400">
                Vắng mặt
              </th>
              <th className="border-b border-gray-700 px-6 py-4 text-left text-lg font-semibold text-blue-400">
                Ghi chú
              </th>
            </tr>
          </thead>
          <tbody>
            {attendanceData?.employees.map((employee) => (
              <tr
                key={employee._id}
                className="hover:bg-gray-800 transition-colors duration-150"
              >
                <td className="border-b border-gray-700 px-6 py-4 text-gray-300 text-lg font-medium">
                  {employee.user_id.name}
                </td>
                <td className="border-b border-gray-700 px-6 py-4">
                  <div className="flex justify-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                        employee.is_present
                          ? "bg-emerald-900/50 border-2 border-emerald-500"
                          : "bg-gray-800 border-2 border-gray-700"
                      }`}
                    >
                      <FaCheck
                        className={`w-5 h-5 ${
                          employee.is_present
                            ? "text-emerald-400"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </td>
                <td className="border-b border-gray-700 px-6 py-4">
                  <div className="flex justify-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                        !employee.is_present
                          ? "bg-red-900/50 border-2 border-red-500"
                          : "bg-gray-800 border-2 border-gray-700"
                      }`}
                    >
                      <FaTimes
                        className={`w-5 h-5 ${
                          !employee.is_present
                            ? "text-red-400"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </td>
                <td className="border-b border-gray-700 px-6 py-4">
                  <input
                    type="text"
                    readOnly
                    value={employee.reason || ""}
                    className="w-full px-4 py-2 text-gray-300 bg-gray-800 border-2 border-gray-700 rounded-lg"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAttendance;
