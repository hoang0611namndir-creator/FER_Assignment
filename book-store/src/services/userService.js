import axiosClient from "./axiosClient";

const userService = {
  // Trả về user nếu đúng username + password, ngược lại trả về null
  login: async (username, password) => {
    const users = await axiosClient.get("/users", { params: { username, password } });
    return users[0] || null;
  },
};

export default userService;
