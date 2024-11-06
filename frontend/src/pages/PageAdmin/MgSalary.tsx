import React, { useState } from "react";

interface Member {
  name: string;
  bankAccount: string;
  salary: number;
  total: number;
  received: number;
  remaining: number;
  image: string;
}

const members: Member[] = [
  {
    name: "Carry Anna",
    bankAccount: "999904567 - MB Bank",
    salary: 5000,
    total: 5600000,
    received: 50000,
    remaining: 5550000,
    image: "/path/to/image1.jpg",
  },
  {
    name: "Carry",
    bankAccount: "999904567 - MB Bank",
    salary: 7000,
    total: 5600000,
    received: 50000,
    remaining: 5550000,
    image: "/path/to/image1.jpg",
  },
  // Add more members as needed
];

export default function MgSalary(): JSX.Element {
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [amountToReceive, setAmountToReceive] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSalaryUpdateClick = (member: Member) => {
    setSelectedMember(member);
    setShowForm(true);
    setErrorMessage(""); // Reset error message when opening form
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedMember(null);
    setAmountToReceive(0);
    setErrorMessage(""); // Reset error message on close
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setAmountToReceive(amount);
  };

  const calculatedReceived = selectedMember
    ? selectedMember.received + amountToReceive
    : 0;

  const calculatedRemaining = selectedMember
    ? selectedMember.total - calculatedReceived
    : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn chặn gửi form mặc định

    if (selectedMember && calculatedReceived > selectedMember.total) {
      setErrorMessage("Lương nhận vượt mức lương được nhận.");
      return;
    }

    // Cập nhật lương ở đây (có thể gọi API hoặc cập nhật state)
    console.log("Cập nhật lương thành công!");
    handleFormClose();
  };

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
              <th className="p-3">Member(Nhân viên)</th>
              <th className="p-3">Bank Number (Số tài khoản)</th>
              <th className="p-3">Monthly Salary (Lương/tháng)</th>
              <th className="p-2">Total Salary Due (Lương phải nhận)</th>
              <th className="p-3">Salary Received (Lương đã nhận)</th>
              <th className="p-3">Remaining Salary (Lương cty nợ)</th>
              <th className="p-3">
                Updates
                <br />
                (Cập nhật)
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={index}
                className="hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <td className="p-3 flex items-center mt-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  {member.name}
                </td>
                <td className="p-3 text-gray-300">{member.bankAccount}</td>
                <td className="p-3 text-gray-300">{member.salary}</td>
                <td className="p-3 text-gray-300">{member.total}</td>
                <td className="p-3 text-gray-300">{member.received}</td>
                <td className="p-3 text-gray-300">{member.remaining}</td>
                <td className="p-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => handleSalaryUpdateClick(member)}
                  >
                    Update Salary
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-xl w-1/3 text-white">
            <h2 className="text-xl font-bold mb-4">Cập nhật lương</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm mb-1">Tên người dùng:</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 border-none text-gray-300"
                  value={selectedMember.name}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Mức lương/tháng:</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 border-none text-gray-300"
                  value={selectedMember.salary}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">
                  Lương tổng phải nhận:
                </label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 border-none text-gray-300"
                  value={selectedMember.total}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">
                  Lương chuẩn bị nhận:
                </label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 border-none text-gray-300"
                  value={amountToReceive}
                  onChange={handleAmountChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Lương đã nhận:</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 border-none text-gray-300"
                  value={calculatedReceived}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Lương còn lại:</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-gray-700 border-none text-gray-300"
                  value={calculatedRemaining}
                  readOnly
                />
              </div>
              {errorMessage && (
                <div className="mb-4 text-red-500">{errorMessage}</div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 mr-2"
                  onClick={handleFormClose}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
