import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu cho thành viên
interface Member {
  title: string;
  content: string;
  joined: string;
}

// Định nghĩa kiểu cho dữ liệu form
interface FormData {
  title: string;
  content: string;
  time: string;
}

const members: Member[] = [
  {
    title: "Thong bao 1",
    content:
      "34 min ago fdjshjghsjdhgjhsdghjksdhjgh hfjshdgjshdghs 34 min ago fdjshjghsjdhgjhsdghjksdhjgh hfjshdgjshdghs34 min ago fdjshjghsjdhgjhsdghjksdhjgh hfjshdgjshdghs34 min ago fdjshjghsjdhgjhsdghjksdhjgh hfjshdgjshdghs",
    joined: "Dec 12, 12:56 PM",
  },
  {
    title: "Thong bao 2",
    content: "34 min ago fdjshjghsjdhgjhsdghjksdhjgh hfjshdgjshdghs ",
    joined: "Dec 9, 2:28 PM",
  },
];

export default function MgNotification() {
  const navigate = useNavigate();
  const [isFormVisible, setFormVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    time: "",
  });

  const handleAddNotificationClick = () => {
    setFormVisible((prev) => !prev); // Chuyển đổi trạng thái hiển thị form
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseForm = () => {
    setFormVisible(false); // Đóng form
    setFormData({ title: "", content: "", time: "" }); // Đặt lại dữ liệu form
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleString(); // Lấy thời gian hiện tại
    const newFormData = { ...formData, time: currentTime }; // Cập nhật thời gian vào dữ liệu form
    console.log(newFormData); // Có thể xử lý gửi dữ liệu ở đây
    handleCloseForm(); // Đóng form sau khi gửi
  };

  return (
    <div
      className="text-white min-h-screen p-10 rounded-xl"
      style={{ backgroundColor: "#21222d" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members</h1>
        <div className="flex space-x-4">
          <button
            className="bg-blue-600 text-base py-2 px-7 rounded-lg hover:bg-blue-500"
            onClick={handleAddNotificationClick}
          >
            + Add Notification
          </button>
        </div>
      </div>

      {isFormVisible && (
        <div className="notification-form fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={handleCloseForm}
            >
              &times; {/* Biểu tượng X */}
            </button>
            <h2 className="text-lg font-bold mb-4">Create Notification</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full p-2 rounded bg-gray-700 text-gray-300 border-none focus:outline-none"
                  placeholder="Enter title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300" htmlFor="content">
                  Content
                </label>
                <textarea
                  name="content"
                  id="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  className="w-full p-2 rounded bg-gray-700 text-gray-300 border-none focus:outline-none"
                  placeholder="Enter content"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300" htmlFor="time">
                  Time
                </label>
                <input
                  type="text"
                  name="time"
                  id="time"
                  value={formData.time}
                  readOnly // Không cho phép chỉnh sửa
                  className="w-full p-2 rounded bg-gray-700 text-gray-300 border-none focus:outline-none"
                  placeholder="Enter time"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
              >
                Create Notification
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl" style={{ backgroundColor: "#171821" }}>
        <input
          type="text"
          placeholder="Search members"
          className="w-full p-2 mb-4 rounded bg-gray-700 border-none focus:outline-none text-gray-300 placeholder-gray-500"
        />
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="p-3">Title</th>
              <th className="p-3">Content</th>
              <th className="p-3">Time</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={index}
                className="hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <td className="p-3 text-gray-300">{member.title}</td>
                <td className="p-3 text-gray-300">{member.content}</td>
                <td className="p-3 text-gray-300">{member.joined}</td>
                <td className="p-3 flex space-x-3">
                  <EyeIcon
                    className="w-5 h-5 text-blue-400 hover:text-blue-300 cursor-pointer"
                    onClick={() => navigate("/admin/user-details")}
                  />
                  <PencilIcon
                    className="w-5 h-5 text-yellow-400 hover:text-yellow-300 cursor-pointer"
                    onClick={() => navigate("/your-edit-path")}
                  />
                  <TrashIcon
                    className="w-5 h-5 text-red-400 hover:text-red-300 cursor-pointer"
                    onClick={() => navigate("/your-delete-path")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
