import React, { useState } from "react";
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
  birthDate: string;
  position: string;
  address: string;
  phone: string;
  salary: string;
  bankAccount: string;
  password: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  salary?: string;
  bankAccount?: string;
  password?: string;
}

const AccountInfo: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "nguyenvana",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    gender: "Nam",
    birthDate: "1990-01-01",
    position: "Nhân viên",
    address: "Hà Nội",
    phone: "0123456789",
    salary: "10,000,000 VNĐ",
    bankAccount: "1234567890",
    password: "********",
  });

  const validate = () => {
    const newErrors: Errors = {};

    // Kiểm tra họ tên không được để trống
    if (!userInfo.name.trim()) {
      newErrors.name = "Họ tên không được để trống.";
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(userInfo.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 chữ số).";
    }

    // Kiểm tra lương không được để trống
    if (!userInfo.salary.trim()) {
      newErrors.salary = "Lương không được để trống.";
    }

    // Kiểm tra số tài khoản không được để trống
    if (!userInfo.bankAccount.trim()) {
      newErrors.bankAccount = "Số tài khoản không được để trống.";
    }

    // Kiểm tra mật khẩu không được để trống
    if (!userInfo.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống.";
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

  const handleSave = () => {
    if (validate()) {
      setIsEditing(false);
      // Thực hiện lưu thông tin người dùng ở đây
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-md mt-[150px] mb-20">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Thông tin tài khoản
      </h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <UserIcon
            className="w-9 h-9 text-gray-600 mr-2"
            style={{ color: "#6d3d45" }}
          />
          <span className="font-medium">{userInfo.username}</span>
        </div>
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <UserIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
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
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <AtSymbolIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
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
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <UserCircleIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
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
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <CalendarIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="date"
            name="birthDate"
            value={userInfo.birthDate}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <BriefcaseIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
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
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <BanknotesIcon
            className="w-10 h-10 text-gray-600 mr-2 p-1 bg-gray-100 rounded"
            style={{ color: "#1da1f2" }}
          />
          <input
            type="text"
            name="bankAccount"
            value={userInfo.bankAccount}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full h-10 border-0 rounded-r-md focus:ring focus:ring-opacity-50 ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          />
        </div>
        {errors.bankAccount && (
          <p className="text-red-500">{errors.bankAccount}</p>
        )}
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
      <div className="flex justify-center mt-6">
        <button
          onClick={isEditing ? handleSave : handleEditToggle}
          className={`flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 ${
            isEditing ? "bg-green-600" : "text-white"
          }`}
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
