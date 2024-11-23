// src/services/authService.ts
import axios from "axios";

// Cấu hình axios cho API
const api = axios.create({
  baseURL: "http://localhost:3000", // Địa chỉ API của bạn
});

// Hàm đăng nhập
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("http://localhost:3000/auth/login", {
      email: username,
      password,
    });
    // Lưu accessToken và refreshToken vào localStorage hoặc cookie
    const { accessToken, refreshToken, expiresIn } = response.data;

    // Lưu token vào localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Cập nhật thời gian hết hạn của token
    const expiresAt = new Date().getTime() + parseInt(expiresIn);
    localStorage.setItem("expiresAt", expiresAt.toString());
    console.log("Thời gian hết hạn", expiresAt.toString());
    return response.data; // Trả về dữ liệu để có thể xử lý thêm (ví dụ: thông tin người dùng)
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message || error);
    throw error;
  }
};

// Hàm lấy thông tin người dùng
export const getUserProfile = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await api.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data; // Trả về thông tin người dùng
  } catch (error) {
    console.error(
      "Failed to fetch user profile:",
      error.response?.data?.message || error
    );
    throw error;
  }
};

// Hàm làm mới token (dùng refreshToken)
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("Refresh token", refreshToken); // Log refreshToken để kiểm tra

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    // Gửi yêu cầu POST đến backend với refresh_token trong body
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken, // Gửi refresh_token trong body theo đúng cấu trúc backend yêu cầu
    });

    // Nhận token mới từ phản hồi
    const { accessToken, expiresIn } = response.data;
    console.log("Token mới", accessToken);

    // Lưu accessToken mới vào localStorage
    localStorage.setItem("accessToken", accessToken);

    // Tính toán và lưu thời gian hết hạn của token
    const expiresAt = new Date().getTime() + expiresIn;
    localStorage.setItem("expiresAt", expiresAt.toString());

    return accessToken; // Trả về accessToken mới
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response?.data?.message || error
    );
    throw error; // Nếu có lỗi, ném lại lỗi
  }
};

// Hàm đăng xuất
export const logout = () => {
  // Xóa các token trong localStorage khi đăng xuất
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiresAt");
  localStorage.removeItem("refreshTokenExpiresAt");
};
