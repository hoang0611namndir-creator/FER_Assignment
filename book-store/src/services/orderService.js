import axiosClient from "./axiosClient";
import bookService from "./bookService";

const orderService = {
  create: (order) => axiosClient.post("/orders", order),

  /**
   * Mua sách: cộng lượt mua (sold) trong database.json và tạo đơn hàng.
   * Lấy lại sách mới nhất trước khi cộng để không ghi đè số cũ.
   * Trả về sách đã cập nhật.
   */
  purchase: async (bookId, userId, quantity = 1) => {
    const latest = await bookService.getById(bookId);
    const updated = await bookService.update(bookId, { sold: (latest.sold || 0) + quantity });
    await orderService.create({
      userId,
      bookId,
      quantity,
      total: latest.price * quantity,
      createdAt: new Date().toISOString(),
    });
    return updated;
  },
};

export default orderService;
