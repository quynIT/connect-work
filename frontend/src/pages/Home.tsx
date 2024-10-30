import React, { useEffect, useState } from "react";
export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = `${currentTime.getDate()}-${currentTime.toLocaleString(
    "en-US",
    {
      month: "short",
    }
  )} ${currentTime.getFullYear()} - Ho Chi Minh City`;

  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center h-screen bgr-header">
      <div className="flex flex-row items-center justify-center space-x-10 w-[1200px]">
        <div className="w-[70%]">
          <h2 className="text-gray-700 text-3xl leading-relaxed">
            Business Leaders
          </h2>
          <h1 className="text-blue-600 text-6xl font-bold mb-6">
            CONFERENCE 2023
          </h1>
          <p className="text-gray-500 mt-2 text-2xl mb-8">📅 {formattedDate}</p>
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

        <form className="mb-10 p-6 bg-white rounded-lg shadow-md w-[30%] h-[400px]">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 mt-3">
            Join Conference
          </h3>
          <input
            type="text"
            placeholder="Enter your Name"
            className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Enter your Email"
            className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="tel"
            placeholder="Enter your Phone"
            className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center mb-4">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-gray-600 text-sm">
              I have read and accept the terms and conditions
            </label>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Join now
          </button>
        </form>
      </div>
    </div>
  );
}
