import axios from "axios";
import { refreshAccessToken } from "./authService";

// Tạo instance axios mới với cấu hình mặc định
const api = axios.create({
  baseURL: "http://localhost:3000", // Địa chỉ API của bạn
});

// Thêm interceptor để thêm accessToken vào header của mỗi request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm interceptor để xử lý lỗi 401 (token hết hạn)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu có lỗi xác thực và chưa thử refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Làm mới token và thử lại yêu cầu cũ
      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        throw new Error("Unable to refresh access token");
      }

      // Lưu token mới vào localStorage
      localStorage.setItem("accessToken", newAccessToken);

      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      // Thử lại yêu cầu cũ với accessToken mới
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
