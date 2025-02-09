import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Header() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context
  };
  const [notification, setNotification] = useState<string | null>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  useEffect(() => {
    // Lưu thời gian thông báo được hiển thị
    const showTime = new Date().getTime();
    localStorage.setItem("notificationTime", showTime.toString());

    // Kiểm tra thời gian và ẩn thông báo sau 24h
    const interval = setInterval(() => {
      const storedTime = localStorage.getItem("notificationTime");
      if (storedTime) {
        const currentTime = new Date().getTime();
        // Kiểm tra xem đã qua 24 giờ chưa (24 * 60 * 60 * 1000 ms)
        if (currentTime - Number(storedTime) > 24 * 60 * 60 * 1000) {
          setNotification(null); // Ẩn thông báo
          localStorage.removeItem("notificationTime"); // Xóa thời gian lưu
          clearInterval(interval);
        }
      }
    }, 1000); // Kiểm tra mỗi giây

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, []);
  return (
    <div className="flex flex-col">
      <section className="relative mx-auto">
        {/* Navbar */}
        <nav className="fixed w-full flex justify-between bg-gray-900 text-white z-20 top-0 left-0">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center">
            <a className="text-3xl font-bold font-heading" href="/">
              Connect Work
            </a>
            {/* Nav Links */}
            <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
              <li>
                <Link className="hover:text-gray-200" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-200" to="/roll-call">
                  Roll Call
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-200" to="/chat-web">
                  Chat
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-200" to="/project-list">
                  Task Board
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-200" to="/recruitment">
                  Recruitment
                </Link>
              </li>
            </ul>
            {/* Header Icons */}
            <div className="hidden xl:flex items-center space-x-5">
              <a className="hover:text-gray-200" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </a>
              <Link
                className="flex items-center hover:text-gray-200"
                to="/notification-list"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" // Thay đổi kích thước biểu tượng
                  height="24" // Thay đổi kích thước biểu tượng
                  fill="currentColor"
                  className="bi bi-bell"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                </svg>
                <span className="flex absolute -mt-5 ml-4">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </Link>

              {/* Sign In / Register */}
              <Link
                className="flex items-center hover:text-gray-200"
                to="#"
                onClick={toggleMenu} // Toggle menu khi click vào icon
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Link>

              {/* Menu hiện ra khi isMenuOpen là true */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-44 mr-32 bg-gray-800 rounded-lg shadow-lg w-48 p-2">
                  <Link
                    to="/account-info"
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                  >
                    Account Settings
                  </Link>
                  <Link
                    to="/change-password"
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                  >
                    Change Password
                  </Link>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
          {/* Responsive navbar */}
          <a className="xl:hidden flex mr-6 items-center" href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hover:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="flex absolute -mt-5 ml-4">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </a>
          <a className="navbar-burger self-center mr-12 xl:hidden" href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hover:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </a>
        </nav>
      </section>

      {notification && (
        <div className="bg-red-500 text-white h-[60px] w-full flex justify-center text-4xl mt-20 sticky top-0">
          <div className="marquee">
            <div className="marquee-content mt-3">{notification}</div>
          </div>
        </div>
      )}
    </div>
  );
}
