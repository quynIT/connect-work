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
  _id?: string;
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
        const accessToken = localStorage.getItem("accessToken"); // Thay bằng accessToken thực tế
        const userId = userInfo._id; // Giả sử 'username' là id của người dùng, thay bằng id thực tế

        const response = await axios.put(
          `http://localhost:3000/user/${userId}`, // Cập nhật với API sử dụng id người dùng
          userInfo,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        console.log(response.data); // Log dữ liệu trả về từ API
        alert("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        alert("Không thể cập nhật thông tin.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border rounded-xl shadow-lg mt-[150px] mb-20 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Thông tin tài khoản
      </h2>
      <div className="space-y-6">
        {/* Username */}
        <div className="flex items-center bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
          <UserIcon className="w-8 h-8 text-blue-500 mr-3" />
          <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">
            {userInfo.username}
          </span>
        </div>

        {/* Name */}
        <div className="flex items-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <UserIcon className="w-10 h-10 text-blue-500 mx-3" />
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`block w-full py-3 px-4 rounded-r-lg transition-colors duration-200 ${
              isEditing
                ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-50 dark:bg-gray-700"
            } border-0 focus:ring-2 text-gray-700 dark:text-gray-200`}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm ml-14">{errors.name}</p>
        )}

        {/* Email */}
        <div className="flex items-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <AtSymbolIcon className="w-10 h-10 text-blue-500 mx-3" />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`block w-full py-3 px-4 rounded-r-lg transition-colors duration-200 ${
              isEditing
                ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-50 dark:bg-gray-700"
            } border-0 focus:ring-2 text-gray-700 dark:text-gray-200`}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm ml-14">{errors.email}</p>
        )}

        {/* Phone */}
        <div className="flex items-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <PhoneIcon className="w-10 h-10 text-blue-500 mx-3" />
          <input
            type="tel"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={`block w-full py-3 px-4 rounded-r-lg transition-colors duration-200 ${
              isEditing
                ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-50 dark:bg-gray-700"
            } border-0 focus:ring-2 text-gray-700 dark:text-gray-200`}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-sm ml-14">{errors.phone}</p>
        )}

        {/* Gender */}
        <div className="flex items-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <UserCircleIcon className="w-10 h-10 text-blue-500 mx-3" />
          <select
            name="gender"
            value={userInfo.gender}
            onChange={handleChange}
            disabled={!isEditing}
            className={`block w-full py-3 px-4 rounded-r-lg transition-colors duration-200 ${
              isEditing
                ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-50 dark:bg-gray-700"
            } border-0 focus:ring-2 text-gray-700 dark:text-gray-200`}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* Birthdate */}
        <div className="flex items-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <CalendarIcon className="w-10 h-10 text-blue-500 mx-3" />
          <input
            type="date"
            name="bithdate"
            value={userInfo.bithdate}
            onChange={handleChange}
            disabled={!isEditing}
            className={`block w-full py-3 px-4 rounded-r-lg transition-colors duration-200 ${
              isEditing
                ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-50 dark:bg-gray-700"
            } border-0 focus:ring-2 text-gray-700 dark:text-gray-200`}
          />
        </div>

        {/* Address */}
        <div className="flex items-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <HomeIcon className="w-10 h-10 text-blue-500 mx-3" />
          <input
            type="text"
            name="address"
            value={userInfo.address}
            onChange={handleChange}
            disabled={!isEditing}
            className={`block w-full py-3 px-4 rounded-r-lg transition-colors duration-200 ${
              isEditing
                ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-50 dark:bg-gray-700"
            } border-0 focus:ring-2 text-gray-700 dark:text-gray-200`}
          />
        </div>

        {/* Position */}
        <div className="flex items-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <BriefcaseIcon className="w-10 h-10 text-blue-500 mx-3" />
          <input
            type="text"
            name="position"
            value={userInfo.position}
            onChange={handleChange}
            disabled={!isEditing}
            className={`block w-full py-3 px-4 rounded-r-lg transition-colors duration-200 ${
              isEditing
                ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-50 dark:bg-gray-700"
            } border-0 focus:ring-2 text-gray-700 dark:text-gray-200`}
          />
        </div>

        {/* Salary */}
        <div className="flex items-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <CurrencyDollarIcon className="w-10 h-10 text-blue-500 mx-3" />
          <input
            type="text"
            name="salary"
            value={userInfo.salary}
            onChange={handleChange}
            disabled={!isEditing}
            className={`block w-full py-3 px-4 rounded-r-lg transition-colors duration-200 ${
              isEditing
                ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-50 dark:bg-gray-700"
            } border-0 focus:ring-2 text-gray-700 dark:text-gray-200`}
          />
        </div>
        {errors.salary && (
          <p className="text-red-500 text-sm ml-14">{errors.salary}</p>
        )}

        {/* Bank Account */}
        <div className="flex items-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <BanknotesIcon className="w-10 h-10 text-blue-500 mx-3" />
          <input
            type="text"
            name="stk"
            value={userInfo.stk}
            onChange={handleChange}
            disabled={!isEditing}
            className={`block w-full py-3 px-4 rounded-r-lg transition-colors duration-200 ${
              isEditing
                ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-50 dark:bg-gray-700"
            } border-0 focus:ring-2 text-gray-700 dark:text-gray-200`}
          />
        </div>
        {errors.stk && (
          <p className="text-red-500 text-sm ml-14">{errors.stk}</p>
        )}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={isEditing ? handleSave : handleEditToggle}
          className={`flex items-center px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 ${
            isEditing
              ? "bg-green-500 hover:bg-green-600 focus:ring-green-300"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
          } text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-4`}
        >
          {isEditing ? (
            <>
              <CheckIcon className="w-6 h-6 mr-2" />
              Lưu
            </>
          ) : (
            <>
              <PencilIcon className="w-6 h-6 mr-2" />
              Chỉnh sửa
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;
