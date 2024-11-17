import axios from "axios";

// Cấu hình instance Axios
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Địa chỉ backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để chèn token vào header của mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Đăng nhập
export const loginApi = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  const { accessToken, refreshToken, expiresIn } = response.data;

  // Lưu cả accessToken và refreshToken vào localStorage
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  // Cấu hình thời gian hết hạn cho accessToken nếu cần
  setTimeout(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, expiresIn * 1000); // Chuyển từ giây sang milisecond

  return accessToken;
};

// Kiểm tra tính hợp lệ của token
export const verifyTokenApi = async () => {
  const response = await api.get("/user/profile");
  return response.data; // Dữ liệu người dùng nếu token hợp lệ
};

// Đăng xuất
export const logoutApi = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
