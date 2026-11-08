import axiosClient from "./axiosClient";

const cartService = {
  getByUser: (userId) => axiosClient.get("/cart", { params: { userId } }),
  add: (item) => axiosClient.post("/cart", item),
  update: (id, data) => axiosClient.patch(`/cart/${id}`, data),
  remove: (id) => axiosClient.delete(`/cart/${id}`),
};

export default cartService;
