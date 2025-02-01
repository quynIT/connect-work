import { useState } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  ChartBarSquareIcon,
  BellIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import Logo from "/logo.png";
import { Link, Outlet } from "react-router-dom";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

type Link =
  | "Dashboard"
  | "Profile"
  | "Manage Notification"
  | "Attendance Management"
  | "Salary Management"
  | "Task Management"
  | "Project Management"
  | "Social Welfare Management";

export default function LayoutAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<Link>("Dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const linkClasses = (linkName: Link): string =>
    `flex items-center p-2 rounded-lg ${
      activeLink === linkName ? "bg-[#a9dfd8] text-[#171821]" : "text-[#87888c]"
    } hover:bg-[#a9dfd8] hover:text-[#171821]`;

  return (
    <div
      className="flex h-screen text-gray-100"
      style={{ backgroundColor: "#171821" }}
    >
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-[300px]" : "w-24"
        } p-4 transition-all duration-300 border-r border-gray-700 fixed h-full`}
      >
        <div className="flex items-center">
          <button
            className="text-gray-300 hover:text-white mb-6"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <img src={Logo} className="w-9 h-9 mr-2" alt="Logo" />
          </button>
          {isSidebarOpen && (
            <div className="text-3xl font-bold text-orange-500 mb-8 mt-1">
              Connect Work
            </div>
          )}
        </div>
        <nav className="space-y-4">
          <Link
            to="/admin"
            className={linkClasses("Dashboard")}
            onClick={() => setActiveLink("Dashboard")}
          >
            <HomeIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-2">Dashboard</span>}
          </Link>
          <Link
            to="/admin/member-list"
            className={linkClasses("Profile")}
            onClick={() => setActiveLink("Profile")}
          >
            <UserCircleIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-2">Profile</span>}
          </Link>
          <Link
            to="/admin/ql-notification"
            className={linkClasses("Manage Notification")}
            onClick={() => setActiveLink("Manage Notification")}
          >
            <ChartBarSquareIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-2">Manage Notification</span>}
          </Link>
          <Link
            to="/admin/ql-attendance"
            className={linkClasses("Attendance Management")}
            onClick={() => setActiveLink("Attendance Management")}
          >
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
            {isSidebarOpen && (
              <span className="ml-2">Attendance Management</span>
            )}
          </Link>
          <Link
            to="/admin/ql-salary"
            className={linkClasses("Salary Management")}
            onClick={() => setActiveLink("Salary Management")}
          >
            <CurrencyDollarIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-2">Salary Management</span>}
          </Link>
          <Link
            to="/admin/task-management"
            className={linkClasses("Task Management")}
            onClick={() => setActiveLink("Task Management")}
          >
            <BriefcaseIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-2">Task Management</span>}
          </Link>
          <Link
            to="/admin/mg-project"
            className={linkClasses("Project Management")}
            onClick={() => setActiveLink("Project Management")}
          >
            <BriefcaseIcon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-2">Project Management</span>}
          </Link>
          <Link
            to="/admin/social-welfare-management"
            className={linkClasses("Social Welfare Management")}
            onClick={() => setActiveLink("Social Welfare Management")}
          >
            <HeartIcon className="w-6 h-6" />
            {isSidebarOpen && (
              <span className="ml-2">Social Welfare Management</span>
            )}
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`${
          isSidebarOpen ? "ml-[300px]" : "ml-24"
        } flex-1 overflow-auto`}
      >
        {/* Navbar */}
        <div className="flex items-center justify-between w-full p-4 z-10">
          <input
            type="text"
            className="w-3/5 p-3 rounded-xl bg-[#21222d] focus:outline-none"
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
              <img src={Logo} alt="Avatar" className="mt-1" />
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

        {/* Content Area */}
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
