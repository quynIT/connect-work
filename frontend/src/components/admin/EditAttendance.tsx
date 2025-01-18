import React, { useEffect, useState } from "react";
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

const EditAttendance = () => {
  const { id } = useParams();
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const handlePresenceToggle = (employeeId: string, isPresent: boolean) => {
    if (!attendanceData) return;

    setAttendanceData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        employees: prev.employees.map((emp) =>
          emp._id === employeeId ? { ...emp, is_present: isPresent } : emp
        ),
      };
    });
  };

  const handleReasonChange = (employeeId: string, reason: string) => {
    if (!attendanceData) return;

    setAttendanceData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        employees: prev.employees.map((emp) =>
          emp._id === employeeId ? { ...emp, reason } : emp
        ),
      };
    });
  };

  const handleSave = async () => {
    if (!attendanceData) return;
    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/attendance-forms/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceData),
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
      }
      if (!response.ok) throw new Error("Failed to save changes");

      // Optional: Show success message
      alert("Changes saved successfully!");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-blue-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-6xl mx-auto bg-gray-900 shadow-2xl rounded-xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
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

        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 
            ${
              saving
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20"
            }`}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      {saveError && (
        <div className="mb-4 p-4 bg-red-900/50 border-2 border-red-500 rounded-lg text-red-400">
          {saveError}
        </div>
      )}

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
                    <button
                      onClick={() => handlePresenceToggle(employee._id, true)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                        employee.is_present
                          ? "bg-emerald-900/50 border-2 border-emerald-500"
                          : "bg-gray-800 border-2 border-gray-700 hover:border-emerald-500/50"
                      }`}
                    >
                      <FaCheck
                        className={`w-5 h-5 ${
                          employee.is_present
                            ? "text-emerald-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>
                </td>
                <td className="border-b border-gray-700 px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handlePresenceToggle(employee._id, false)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                        !employee.is_present
                          ? "bg-red-900/50 border-2 border-red-500"
                          : "bg-gray-800 border-2 border-gray-700 hover:border-red-500/50"
                      }`}
                    >
                      <FaTimes
                        className={`w-5 h-5 ${
                          !employee.is_present
                            ? "text-red-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>
                </td>
                <td className="border-b border-gray-700 px-6 py-4">
                  <input
                    type="text"
                    value={employee.reason || ""}
                    onChange={(e) =>
                      handleReasonChange(employee._id, e.target.value)
                    }
                    placeholder="Nhập lý do vắng mặt..."
                    className="w-full px-4 py-2 text-gray-300 bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
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

export default EditAttendance;
