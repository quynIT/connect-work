// src/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login,
  getUserProfile,
  logout,
  refreshAccessToken,
} from "../services/authService";

// Định nghĩa kiểu dữ liệu người dùng
interface User {
  id: string;
  username: string;
  email: string;
}

// Định nghĩa kiểu AuthContext
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Tạo context với giá trị mặc định là null
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token và lấy thông tin người dùng khi load ứng dụng
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Hàm đăng nhập
  const loginHandler = async (username: string, password: string) => {
    const userData = await login(username, password);
    setUser(userData); // Lưu thông tin người dùng
  };

  // Hàm đăng xuất
  const logoutHandler = () => {
    logout();
    setUser(null); // Đăng xuất và xóa thông tin người dùng
  };

  // Hàm làm mới token
  const refreshTokenHandler = async () => {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      // Cập nhật lại thông tin người dùng sau khi làm mới token
      const userData = await getUserProfile();
      setUser(userData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginHandler,
        logout: logoutHandler,
        refreshToken: refreshTokenHandler,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
export { AuthContext };
