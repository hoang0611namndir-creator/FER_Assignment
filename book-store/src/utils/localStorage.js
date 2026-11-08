// Các hàm lưu / đọc / xóa phiên đăng nhập trong localStorage của trình duyệt
const USER_KEY = "user";

export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null; // dữ liệu hỏng hoặc không đọc được
  }
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};
