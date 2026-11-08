import axiosClient from "./axiosClient";

const bookService = {
  getAll: () => axiosClient.get("/books"),
  getById: (id) => axiosClient.get(`/books/${id}`),
  update: (id, data) => axiosClient.patch(`/books/${id}`, data),
  getCategories: () => axiosClient.get("/categories"),
};

export default bookService;
