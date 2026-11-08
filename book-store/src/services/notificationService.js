import axiosClient from "./axiosClient";

const notificationService = {
  // Thông báo của user + thông báo chung (userId = 0), mới nhất lên đầu
  getByUser: (userId) =>
    axiosClient.get(`/notifications?userId=0&userId=${userId}&_sort=createdAt&_order=desc`),
  add: (data) => axiosClient.post("/notifications", data),
  markRead: (id) => axiosClient.patch(`/notifications/${id}`, { read: true }),
};

export default notificationService;
