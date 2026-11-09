import { createContext, useCallback, useContext, useEffect, useState } from "react";
import notificationService from "../services/notificationService";
import userService from "../services/userService";
import { getUser, removeUser, saveUser } from "../utils/localStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());
  const [notifications, setNotifications] = useState([]);

  const login = async (username, password) => {
    const found = await userService.login(username, password);
    if (!found) return false;
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    saveUser(safeUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
    removeUser();
  };

  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setNotifications(await notificationService.getByUser(user.id));
    } catch {
      /* server chưa chạy: bỏ qua */
    }
  }, [user]);

  // Thêm thông báo mới vào database và cập nhật chuông
  const notify = async (message) => {
    if (!user) return;
    await notificationService.add({
      userId: user.id,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    });
    refreshNotifications();
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => notificationService.markRead(n.id)));
    refreshNotifications();
  };

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, notifications, notify, markAllRead, refreshNotifications }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
