import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { AuthContext } from "../../auth/AuthContext"; // Import đúng từ AuthContext

export default function LayoutUser() {
  const context = useContext(AuthContext); // Lấy context

  if (!context) {
    return <div>Loading...</div>; // Đảm bảo context không null
  }

  const { user, loading } = context; // Lấy dữ liệu user và loading từ context

  // Nếu dữ liệu người dùng chưa được xác thực, hoặc đang load, không render gì
  if (loading) {
    return <div>Loading...</div>; // Hoặc có thể không render gì nếu không cần thông báo loading
  }

  // Nếu chưa có user, chuyển hướng đến trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
