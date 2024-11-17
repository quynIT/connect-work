import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useAuth } from "../../auth/AuthContext"; // Import useAuth để gọi login từ context

export default function LoginUser() {
  const { login } = useAuth(); // Lấy hàm login từ context
  const navigate = useNavigate(); // Dùng để chuyển hướng
  const [currentTime, setCurrentTime] = useState(new Date()); // State cho thời gian hiện tại
  const [email, setEmail] = useState(""); // State cho email
  const [password, setPassword] = useState(""); // State cho password
  const [error, setError] = useState(""); // State cho lỗi

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Hàm format thời gian
  const formattedDate = `${currentTime.getDate()}-${currentTime.toLocaleString(
    "en-US",
    { month: "short" }
  )} ${currentTime.getFullYear()} - Ho Chi Minh City`;

  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");

  // Hàm handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password); // Gọi hàm login từ context
      navigate("/"); // Chuyển hướng sau khi đăng nhập thành công
    } catch (e) {
      setError("Invalid email or password"); // Hiển thị lỗi nếu đăng nhập không thành công
    }
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen bgr-header pt-8">
        <div className="flex flex-row items-center justify-center space-x-10 w-[1200px]">
          <div className="w-[70%]">
            <h2 className="text-gray-700 text-3xl leading-relaxed">
              Business Leaders
            </h2>
            <h1 className="text-blue-600 text-6xl font-bold mb-6">
              CONFERENCE 2023
            </h1>
            <p className="text-gray-500 mt-2 text-2xl mb-8">
              📅 {formattedDate}
            </p>
            <div className="flex space-x-4 mt-4 gap-7">
              <div className="text-blue-600 text-4xl font-semibold pr-9 border-r-2 border-gray-300">
                {hours}
              </div>
              <div className="text-blue-600 text-4xl font-semibold pr-9 border-r-2 border-gray-300">
                {minutes}
              </div>
              <div className="text-blue-600 text-4xl font-semibold">
                {seconds}
              </div>
            </div>
            <div className="flex space-x-4 mt-2 gap-11 mb-2">
              <div className="text-gray-500 text-sm">HOURS</div>
              <div className="text-gray-500 text-sm">MINUTES</div>
              <div className="text-gray-500 text-sm">SECONDS</div>
            </div>
          </div>

          {/* Form đăng nhập */}
          <form
            className="mb-3 p-6 bg-white rounded-lg shadow-md w-[30%] h-[400px]"
            onSubmit={handleSubmit}
          >
            <h3 className="text-2xl font-bold text-gray-700 mb-7 mt-5">
              Join Conference
            </h3>

            {/* Email input */}
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị email
            />

            {/* Password input */}
            <input
              type="password"
              placeholder="Enter your Password"
              className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Cập nhật giá trị password
            />

            {/* Điều khoản */}
            <div className="flex items-center mb-4">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-gray-600 text-sm mb-3">
                I have read and accept the terms and conditions
              </label>
            </div>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Nút Login */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
