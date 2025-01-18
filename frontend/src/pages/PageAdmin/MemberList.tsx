import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu thành viên
    fetch("http://localhost:3000/user/list")
      .then((response) => response.json())
      .then((data) => {
        setMembers(data); // Lưu dữ liệu vào state
      })
      .catch((error) => console.error("Error fetching members:", error));
  }, []);

  return (
    <div
      className=" text-white min-h-screen p-10 rounded-xl"
      style={{ backgroundColor: "#21222d" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members</h1>
        <div className="flex space-x-4">
          <button
            className="bg-blue-600 text-base py-2 px-7 rounded-lg hover:bg-blue-500"
            onClick={() => navigate("/admin/add-member")}
          >
            + Add member
          </button>
        </div>
      </div>

      <div className=" p-4 rounded-xl" style={{ backgroundColor: "#171821" }}>
        <input
          type="text"
          placeholder="Search members"
          className="w-full p-2 mb-4 rounded bg-gray-700 border-none focus:outline-none text-gray-300 placeholder-gray-500"
        />
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="p-3">Member</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile Number</th>
              <th className="p-3">City</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={index}
                className="hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <td className="p-3 flex items-center">
                  <img
                    src={member.avt}
                    alt={member.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  {member.name}
                </td>
                <td className="p-3 text-gray-300">{member.email}</td>
                <td className="p-3 text-gray-300">{member.phone}</td>
                <td className="p-3 text-gray-300">{member.address}</td>
                <td className="p-3 text-gray-300">
                  {new Date(member.createdAt).toLocaleString()}
                </td>
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
