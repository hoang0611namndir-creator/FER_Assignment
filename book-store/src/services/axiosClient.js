import axios from "axios";

// Một instance axios dùng chung cho cả app, trỏ tới json-server (database.json)
const axiosClient = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Interceptor response: trả thẳng data, gom lỗi về một chỗ
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response
      ? `Lỗi ${status} khi gọi ${error.config?.url}`
      : "Không kết nối được tới server (hãy chạy: npm run server)";
    console.error(message);
    return Promise.reject({ status, message });
  }
);

export default axiosClient;
