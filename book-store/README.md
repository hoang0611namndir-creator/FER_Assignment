# BookStore — React + json-server

## Chạy dự án

```bash
npm install
npm start        # chạy cùng lúc json-server (cổng 3001) và Vite (cổng 5173)
```

Hoặc chạy riêng: `npm run server` và `npm run dev`.

Mở http://localhost:5173 — tài khoản demo: `user / 123456` hoặc `admin / 123456`.

## Cấu trúc

```
database.json          # dữ liệu: users, categories, books, cart, orders, notifications
src/
  api.js               # các hàm gọi json-server
  purchase.js          # logic mua: cộng sold, tạo order
  context/AuthContext  # đăng nhập + thông báo
  components/          # Header, BookCard, BookList (lọc + phân trang), NotificationBell (Modal), Paging, Rating
  pages/               # Home, Category, About, Login, Details, Cart, ErrorPage
```

## Route

| URL | Trang |
| --- | --- |
| `/` | Sách hot (top 6 theo `sold`) + danh sách có lọc/tìm kiếm/phân trang |
| `/category?cat=1` | Lọc theo danh mục |
| `/about` | Giới thiệu |
| `/login` | Đăng nhập |
| `/details?id=1` | Chi tiết sách (col 5 / col 7) |
| `/cart` | Giỏ hàng (cần đăng nhập) |
| `/error`, `*` | Trang báo lỗi |
