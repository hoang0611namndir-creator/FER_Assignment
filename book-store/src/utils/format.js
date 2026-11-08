export const formatPrice = (n) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
