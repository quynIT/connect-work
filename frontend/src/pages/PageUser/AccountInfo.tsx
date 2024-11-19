import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PencilIcon,
  CheckIcon,
  UserIcon,
  AtSymbolIcon,
  UserCircleIcon,
  CalendarIcon,
  BriefcaseIcon,
  HomeIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";

interface UserInfo {
  username: string;
  name: string;
  email: string;
  gender: string;
  bithdate: string;
  position: string;
  address: string;
  phone: string;
  salary: string;
  stk: string;
  password: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  salary?: string;
  stk?: string;
  password?: string;
}

const AccountInfo: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    name: "",
    email: "",
    gender: "",
    bithdate: "",
    position: "",
    address: "",
    phone: "",
    salary: "",
    stk: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Lấy accessToken từ localStorage
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("AccessToken không tồn tại. Vui lòng đăng nhập lại.");
        }

        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUserInfo(response.data); // Cập nhật thông tin người dùng
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        alert(
          "Không thể tải thông tin người dùng. Vui lòng kiểm tra đăng nhập."
        );
      }
    };

    fetchUserInfo();
  }, []);

  const validate = () => {
    const newErrors: Errors = {};

    if (!userInfo.name.trim()) {
      newErrors.name = "Họ tên không được để trống.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(userInfo.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 chữ số).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (validate()) {
      try {
        const accessToken = "your_access_token_here"; // Thay bằng accessToken thực tế
        const response = await axios.put(
          "http://localhost:3000/user/profile",
          userInfo,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        alert("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        alert("Không thể cập nhật thông tin.");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-md mt-[150px] mb-20">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Thông tin tài khoản
      </h2>
      <div className="space-y-4">
        {/* Username */}
        <div className="flex items-center">
          <UserIcon className="w-9 h-9 text-gray-600 mr-2" />
          <span className="font-medium">{userInfo.username}</span>
        </div>

        {/* Name */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <UserIcon
            className="w-10 h-10 text-gray-600 mr-2"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        {/* Email */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <AtSymbolIcon
            className="w-10 h-10 text-gray-600 mr-2"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        {/* Phone */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <PhoneIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="tel"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
        {/* Gender */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <UserCircleIcon
            className="w-10 h-10 text-gray-600 mr-2"
            style={{ color: "#1da1f2" }}
          />
          <select
            name="gender"
            value={userInfo.gender}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* bithdate */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <CalendarIcon
            className="w-10 h-10 text-gray-600 mr-2"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="date"
            name="bithdate"
            value={userInfo.bithdate}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {/* Address */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <HomeIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="text"
            name="address"
            value={userInfo.address}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {/* Position */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <BriefcaseIcon
            className="w-10 h-10 text-gray-600 mr-2"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="text"
            name="position"
            value={userInfo.position}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {/* Salary */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <CurrencyDollarIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="text"
            name="salary"
            value={userInfo.salary}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {errors.salary && <p className="text-red-500">{errors.salary}</p>}
        {/* Bank Account (STK) */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <BanknotesIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="text"
            name="stk"
            value={userInfo.stk}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {errors.stk && <p className="text-red-500">{errors.stk}</p>}

        {/* Password */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <KeyIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="password"
            name="password"
            value={userInfo.password}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={isEditing ? handleSave : handleEditToggle}
          className={`flex items-center px-6 py-2 ${
            isEditing ? "bg-green-600" : "bg-blue-600"
          } text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300`}
        >
          {isEditing ? (
            <>
              <CheckIcon className="w-5 h-5 mr-1" />
              Lưu
            </>
          ) : (
            <>
              <PencilIcon className="w-5 h-5 mr-1" />
              Chỉnh sửa
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;
