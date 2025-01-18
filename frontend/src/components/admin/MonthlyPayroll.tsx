import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaCalendarAlt, FaDollarSign, FaCheckCircle } from "react-icons/fa";

interface AttendanceData {
  date: string;
  is_present: boolean;
}

interface PayrollItem {
  month: string;
  present: number;
  absent: number;
  salary: number | null;
}

interface PaymentStatus {
  [key: string]: boolean;
}

const MonthlyPayroll: React.FC = () => {
  const { id } = useParams();
  const [payrollData, setPayrollData] = useState<PayrollItem[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({});

  const formatMonthYear = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/attendance-records/user-attendance-details?user_id=${id}`
      );
      const data = await response.json();
      const processedData = processAttendanceData(data);
      setPayrollData(processedData);

      processedData.forEach((item) => {
        checkPaymentStatus(item.month);
      });
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const processAttendanceData = (data: AttendanceData[]): PayrollItem[] => {
    const monthlyData: {
      [key: string]: { present: number; absent: number; salary: number | null };
    } = {};

    data.forEach((entry) => {
      const monthKey = formatMonthYear(entry.date);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          present: 0,
          absent: 0,
          salary: null,
        };
      }
      if (entry.is_present) {
        monthlyData[monthKey].present += 1;
      } else {
        monthlyData[monthKey].absent += 1;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));
  };

  const calculateSalary = async (month: string) => {
    try {
      console.log(id, month);
      // Gửi request để tính lương
      const response = await fetch(
        `http://localhost:3000/payrolls/generate?user_id=${id}&month=${month}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      // Sau khi tính lương, bạn gọi API để lấy thông tin lương đã được tính
      const payrollResponse = await fetch(
        `http://localhost:3000/payrolls/by-month?user_id=${id}&month=${month}`
      );
      const payrollData = await payrollResponse.json();

      // Cập nhật lại dữ liệu với thông tin từ API trả về
      setPayrollData((prevData) =>
        prevData.map((item) =>
          item.month === month
            ? {
                ...item,
                salary: payrollData.total_salary, // Lương mới
                isPaid: payrollData.isPaid, // Trạng thái đã thanh toán
              }
            : item
        )
      );

      // Cập nhật lại trạng thái thanh toán
      setPaymentStatus((prev) => ({ ...prev, [month]: payrollData.isPaid }));
    } catch (error) {
      console.error("Error calculating salary:", error);
    }
  };

  const checkPaymentStatus = async (month: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/payrolls/by-month?user_id=${id}&month=${month}`
      );
      const data = await response.json();
      setPaymentStatus((prev) => ({ ...prev, [month]: data.isPaid }));
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAttendanceData();
    }
  }, [id]);

  const handlePayment = async (month: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to pay the salary for ${month}?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/payrolls/update/${id}/${month}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPaid: true, note: "Paid successfully" }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPaymentStatus((prev) => ({ ...prev, [month]: true }));
      } else {
        console.error("Failed to update payment status:", data.message);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div className="w-full  bg-[#171821] rounded-lg shadow-lg">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-gray-100">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left p-3 font-semibold">Tháng</th>
                <th className="text-center p-3 font-semibold">Ngày làm</th>
                <th className="text-center p-3 font-semibold">Ngày nghỉ</th>
                <th className="text-center p-3 font-semibold">Lương</th>
                <th className="text-center p-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((item) => (
                <tr
                  key={item.month}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>{item.month}</span>
                    </div>
                  </td>
                  <td className="text-center p-3">{item.present}</td>
                  <td className="text-center p-3">{item.absent}</td>
                  <td className="text-center p-3">
                    {item.salary !== null ? (
                      <div className="flex items-center justify-center gap-1 text-green-400">
                        <FaDollarSign />
                        <span>{item.salary.toLocaleString()} VND</span>
                      </div>
                    ) : (
                      <button
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => calculateSalary(item.month)}
                      >
                        Tính lương
                      </button>
                    )}
                  </td>
                  <td className="text-center p-3">
                    {paymentStatus[item.month] ? (
                      <div className="flex items-center justify-center gap-1 text-green-500">
                        <FaCheckCircle />
                        <span>Đã thanh toán</span>
                      </div>
                    ) : (
                      <button
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                        onClick={() => handlePayment(item.month)}
                      >
                        Thanh toán
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPayroll;
