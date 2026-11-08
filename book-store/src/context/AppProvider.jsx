import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import bookService from "../services/bookService";

const AppContext = createContext(null);

/**
 * AppProvider: tải dữ liệu chung (books, categories) từ database.json MỘT lần
 * và chia sẻ cho toàn bộ app qua hook useApp().
 */
export function AppProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookData, categoryData] = await Promise.all([
        bookService.getAll(),
        bookService.getCategories(),
      ]);
      setBooks(bookData);
      setCategories(categoryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cập nhật 1 quyển sách trong state (vd: sau khi mua, sold tăng)
  const updateBookInState = useCallback((updated) => {
    setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  // Top 6 sách có lượt mua cao nhất
  const hotBooks = useMemo(() => [...books].sort((a, b) => b.sold - a.sold).slice(0, 6), [books]);

  const getCategoryName = useCallback(
    (id) => categories.find((c) => String(c.id) === String(id))?.name || "",
    [categories]
  );

  return (
    <AppContext.Provider
      value={{
        books,
        categories,
        hotBooks,
        loading,
        error,
        reload: loadData,
        updateBookInState,
        getCategoryName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
