import React, { useState, useEffect, ChangeEvent } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaHome,
  FaDollarSign,
  FaCamera,
  FaVenusMars,
  FaUserClock,
  FaMoneyCheckAlt,
} from "react-icons/fa";

function AddEmployee() {
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  useEffect(() => {
    const usernameFromEmail = email.split("@")[0];
    setUsername(usernameFromEmail);
  }, [email]);

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setPassword(randomPassword);
  };
  const isValidAge = (dob: string): boolean => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Kiểm tra nếu người dùng đủ 18 tuổi
    return (
      age > 18 ||
      (age === 18 && monthDifference > 0) ||
      (age === 18 &&
        monthDifference === 0 &&
        today.getDate() >= birthDate.getDate())
    );
  };
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate email
    if (!email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate username
    if (!username) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    }

    // Validate phone number
    if (!phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    }

    // Validate salary
    if (!salary) {
      newErrors.salary = "Lương là bắt buộc";
    } else if (isNaN(Number(salary))) {
      newErrors.salary = "Lương phải là một số";
    }

    // Validate address
    if (!address) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    // Validate position
    if (!position) {
      newErrors.position = "Chức vụ là bắt buộc";
    }

    // Validate bank account
    if (!bankAccount) {
      newErrors.bankAccount = "Số tài khoản ngân hàng là bắt buộc";
    }

    // Validate date of birth
    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    } else if (!isValidAge(dateOfBirth)) {
      newErrors.dateOfBirth = "Người dùng phải trên 18 tuổi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Nếu không có lỗi thì trả về true
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      // Xử lý thêm nhân viên
      console.log("Form is valid, submitting...");
    }
  };

  return (
    <div className="bg-[#21222d] text-white p-6 rounded-xl max-w-7xl mx-auto">
      <h2 className="text-center text-2xl font-bold mb-6">Thêm Nhân Viên</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FaEnvelope className="w-5 h-5 text-blue-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <div className="flex items-center space-x-2">
            <FaUser className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.username && <p className="text-red-500">{errors.username}</p>}

          <div className="flex items-center space-x-2">
            <FaPhone className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}

          <div className="flex items-center space-x-2">
            <FaDollarSign className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Lương"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.salary && <p className="text-red-500">{errors.salary}</p>}

          <div className="flex items-center space-x-2">
            <FaVenusMars className="w-5 h-5 text-blue-400" />
            <select className="bg-[#171821] text-white w-full p-2 rounded-xl">
              <option value="" disabled selected>
                Giới tính
              </option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FaUserClock className="w-5 h-5 text-blue-400" />
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.dateOfBirth && (
            <p className="text-red-500">{errors.dateOfBirth}</p>
          )}

          <div className="flex items-center space-x-2">
            <FaMoneyCheckAlt className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Số tài khoản ngân hàng"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.bankAccount && (
            <p className="text-red-500">{errors.bankAccount}</p>
          )}

          <div className="flex items-center space-x-2">
            <FaUser className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={password}
              placeholder="Mật khẩu"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
              readOnly
            />
            <button
              type="button"
              onClick={generateRandomPassword}
              className="bg-blue-500 text-white px-4 rounded-xl ml-2"
            >
              Tạo Mật Khẩu
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FaHome className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.address && <p className="text-red-500">{errors.address}</p>}

          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Chức vụ"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.position && <p className="text-red-500">{errors.position}</p>}

          <div className="flex items-center space-x-2">
            <label className="flex items-center justify-center bg-[#171821] w-full h-full rounded-xl cursor-pointer">
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="max-h-[260px] w-full object-cover rounded-lg"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-blue-400 rounded-lg">
                  <FaCamera className="text-blue-400 w-[100px] h-[100px] m-[78px]" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden" // Ẩn input file
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-full mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-green-500 text-white w-64 p-2 rounded-xl hover:bg-green-600"
          >
            Thêm Nhân Viên
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;
