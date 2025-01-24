import { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";

interface Member {
  _id: string;
  name: string;
  avt: string;
  salary: number;
  totalExpectedSalary: number;
  totalPaidSalary: number;
  totalUnpaidSalary: number;
}

const fetchMembersData = async (): Promise<Member[]> => {
  const response = await fetch("http://localhost:3000/payrolls/summary");
  const data = await response.json();
  return data.map((item: any) => ({
    _id: item._id,
    name: item.name,
    avt: item.avt,
    salary: item.salary,
    totalExpectedSalary: item.totalExpectedSalary,
    totalPaidSalary: item.totalPaidSalary,
    totalUnpaidSalary: item.totalUnpaidSalary,
  }));
};

export default function MgSalary(): JSX.Element {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const loadMembers = async () => {
      const membersData = await fetchMembersData();
      setMembers(membersData);
    };
    loadMembers();
  }, []);

  return (
    <div
      className="text-white min-h-screen p-5 rounded-xl"
      style={{ backgroundColor: "#21222d" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Salary Management</h1>
      </div>

      <div className="p-4 rounded-xl" style={{ backgroundColor: "#171821" }}>
        <div className="flex">
          <input
            type="text"
            placeholder="Search members"
            className="w-3/5 p-2 rounded-xl bg-gray-700 border-none focus:outline-none text-gray-300 placeholder-gray-500"
          />
          <button className="bg-blue-500 text-white ml-7 px-4 hover:bg-blue-700 w-40 h-12 rounded-xl">
            Search
          </button>
        </div>
        <table className="w-full text-left mt-4">
          <thead>
            <tr className="text-gray-400">
              <th className="p-3">Member (Nhân viên)</th>
              <th className="p-3">Monthly Salary (Lương/Ngày)</th>
              <th className="p-3">Total Salary Due (Lương phải nhận)</th>
              <th className="p-3">Salary Received (Lương đã nhận)</th>
              <th className="p-3">Remaining Salary (Lương công ty nợ)</th>
              <th className="p-3">View</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member._id}
                className="hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <td className="p-3 flex items-center mt-3">
                  <img
                    src={member.avt}
                    alt={member.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  {member.name}
                </td>
                <td className="p-3 text-gray-300">{member.salary}</td>
                <td className="p-3 text-gray-300">
                  {member.totalExpectedSalary}
                </td>
                <td className="p-3 text-gray-300">{member.totalPaidSalary}</td>
                <td className="p-3 text-gray-300">
                  {member.totalUnpaidSalary}
                </td>
                <td className="p-3">
                  <Link to={`/admin/monthly-salary/${member._id}`}>
                    <FiEye className="text-blue-500 cursor-pointer" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
