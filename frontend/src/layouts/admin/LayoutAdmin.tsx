import React, { useState } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  ChartBarSquareIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import Logo from "/logo.png";
import { Outlet } from "react-router-dom";

export default function LayoutAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-[300px]" : "w-24"
        } bg-gray-800 p-4 transition-all duration-300`}
      >
        <div className="flex">
          <button
            className="text-gray-300 hover:text-white mb-6"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <img src={Logo} className="w-9 h-9 mr-2" />
          </button>
          <div className="text-2xl font-bold text-orange-500 mb-8 mt-1">
            {isSidebarOpen && "Connect Work"}
          </div>
        </div>
        <nav className="space-y-4">
          <a
            href="#"
            className="flex items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-700"
          >
            <HomeIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-2">Dashboard</span>}
          </a>
          <a
            href="#"
            className="flex items-center p-2 hover:bg-gray-700 rounded-lg"
          >
            <UserCircleIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-2">Profile</span>}
          </a>
          <a
            href="#"
            className="flex items-center p-2 hover:bg-gray-700 rounded-lg"
          >
            <ChartBarSquareIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-2">Sales Report</span>}
          </a>
        </nav>
      </div>
      <div className="flex-1 p-6">
        {/* Navbar */}
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            className="w-1/2 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
            placeholder="Search here..."
          />
          <div className="flex items-center space-x-4 relative">
            {/* Notification Icon */}
            <button className="relative p-2 bg-gray-800 rounded-full">
              <BellIcon className="w-6 h-6 text-gray-400" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-full bg-gray-700 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <img src={Logo} alt="Image" className="mt-1" />
            </div>
            {isMenuOpen && (
              <div className="absolute right-0 mt-36 bg-gray-800 rounded-lg shadow-lg w-48 p-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                >
                  Account Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
