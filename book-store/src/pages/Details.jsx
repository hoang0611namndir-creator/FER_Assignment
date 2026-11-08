import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Image,
  Modal,
  Ratio,
  Row,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Rating from "../components/Rating";
import { useApp } from "../context/AppProvider";
import { useAuth } from "../context/AuthContext";
import bookService from "../services/bookService";
import cartService from "../services/cartService";
import orderService from "../services/orderService";
import { formatPrice } from "../utils/format";

export default function Details() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const { user, notify } = useAuth();
  const { categories, updateBookInState } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!id) return;
    setBook(null);
    // Lấy bản mới nhất của sách từ server (để số "đã bán" luôn chính xác)
    bookService
      .getById(id)
      .then(setBook)
      .catch((e) => setError(e.status === 404 ? 404 : 500));
  }, [id]);

  const category = book ? categories.find((c) => c.id === book.categoryId) : null;

  if (!id || error === 404) {
    return <Navigate to="/error" replace state={{ code: 404, message: "Không tìm thấy quyển sách này." }} />;
  }
  if (error) {
    return <Navigate to="/error" replace state={{ code: 500, message: "Không tải được dữ liệu sách." }} />;
  }
  if (!book) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  const requireLogin = () => {
    if (user) return true;
    navigate("/login", { state: { from: location } });
    return false;
  };

  const handleAddToCart = async () => {
    if (!requireLogin()) return;
    setBusy(true);
    try {
      const cart = await cartService.getByUser(user.id);
      const existing = cart.find((c) => c.bookId === book.id);
      if (existing) await cartService.update(existing.id, { quantity: existing.quantity + 1 });
      else await cartService.add({ userId: user.id, bookId: book.id, quantity: 1 });
      setToast(`Đã thêm "${book.title}" vào giỏ hàng`);
    } catch {
      setToast("Thêm vào giỏ hàng thất bại!");
    } finally {
      setBusy(false);
    }
  };

  const handleBuy = async () => {
    setBusy(true);
    try {
      const updated = await orderService.purchase(book.id, user.id, 1); // +1 lượt mua
      setBook(updated);
      updateBookInState(updated); // sách hot + danh sách cập nhật ngay
      await notify(`Bạn đã mua thành công "${book.title}" - ${formatPrice(book.price)}`);
      setToast("Mua hàng thành công! Kiểm tra chuông thông báo nhé.");
    } catch {
      setToast("Mua hàng thất bại, vui lòng thử lại!");
    } finally {
      setBusy(false);
      setConfirm(false);
    }
  };

  return (
    <Container>
      <nav className="mb-3 small">
        <Link to="/">Home</Link> /{" "}
        {category && <Link to={`/category?cat=${category.id}`}>{category.name}</Link>} / {book.title}
      </nav>

      <div className="bg-white rounded-4 shadow-sm p-4">
        <Row className="g-4">
          {/* Cột trái: ảnh + nút */}
          <Col md={5}>
            <Ratio aspectRatio={140} className="mb-3">
              <Image src={book.image} alt={book.title} rounded className="object-fit-cover" />
            </Ratio>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" className="flex-fill" disabled={busy} onClick={handleAddToCart}>
                <i className="bi bi-cart-plus me-1" />
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="danger"
                className="flex-fill"
                disabled={busy}
                onClick={() => requireLogin() && setConfirm(true)}
              >
                <i className="bi bi-bag-check me-1" />
                Mua ngay
              </Button>
            </div>
          </Col>

          {/* Cột phải: thông tin */}
          <Col md={7}>
            {category && <Badge bg="secondary" className="mb-2">{category.name}</Badge>}
            <h2>{book.title}</h2>
            <p className="text-muted">
              Tác giả: <strong>{book.author}</strong>
            </p>
            <div className="d-flex flex-wrap gap-4 mb-3">
              <div>
                <Rating value={book.rating} />
              </div>
              <div className="text-muted">
                <i className="bi bi-bag me-1" />
                Đã bán: <strong>{book.sold}</strong>
              </div>
            </div>
            <h3 className="text-danger fw-bold mb-4">{formatPrice(book.price)}</h3>
            <h5>Mô tả</h5>
            <p>{book.description}</p>
          </Col>
        </Row>
      </div>

      {/* Modal xác nhận mua */}
      <Modal show={confirm} onHide={() => setConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận mua hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn muốn mua <strong>{book.title}</strong> với giá{" "}
          <strong className="text-danger">{formatPrice(book.price)}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirm(false)}>
            Hủy
          </Button>
          <Button variant="danger" disabled={busy} onClick={handleBuy}>
            {busy ? <Spinner size="sm" /> : "Xác nhận mua"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={!!toast} onClose={() => setToast("")} delay={3000} autohide bg="dark">
          <Toast.Body className="text-white">{toast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
