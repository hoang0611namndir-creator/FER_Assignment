import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Container, Image, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppProvider";
import { useAuth } from "../context/AuthContext";
import cartService from "../services/cartService";
import orderService from "../services/orderService";
import { formatPrice } from "../utils/format";

export default function Cart() {
  const { user, notify } = useAuth();
  const { books, updateBookInState } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // Lấy giỏ hàng từ server, ghép với thông tin sách có sẵn trong AppProvider
  const load = useCallback(async () => {
    const cart = await cartService.getByUser(user.id);
    setItems(
      cart
        .map((c) => ({ ...c, book: books.find((b) => b.id === c.bookId) }))
        .filter((c) => c.book)
    );
    setLoading(false);
  }, [user.id, books]);

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, [load]);

  const changeQty = async (item, delta) => {
    const quantity = item.quantity + delta;
    if (quantity < 1) return;
    await cartService.update(item.id, { quantity });
    load();
  };

  const remove = async (item) => {
    await cartService.remove(item.id);
    load();
  };

  const checkout = async () => {
    setBusy(true);
    try {
      for (const item of items) {
        const updated = await orderService.purchase(item.bookId, user.id, item.quantity);
        updateBookInState(updated);
        await cartService.remove(item.id);
      }
      await notify(`Thanh toán thành công ${items.length} đầu sách - tổng ${formatPrice(total)}`);
      setMessage("Thanh toán thành công!");
      load();
    } catch {
      setMessage("Thanh toán thất bại, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  const total = items.reduce((s, i) => s + i.book.price * i.quantity, 0);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container>
      <h3 className="mb-4">
        <i className="bi bi-cart3 me-2" />
        Giỏ hàng
      </h3>
      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      {items.length === 0 ? (
        <Alert variant="info">
          Giỏ hàng trống. <Link to="/">Tiếp tục mua sắm</Link>
        </Alert>
      ) : (
        <div className="bg-white rounded-4 shadow-sm p-3">
          <Table responsive className="align-middle mb-0">
            <thead>
              <tr>
                <th>Sách</th>
                <th>Giá</th>
                <th className="text-center">Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>
                    <Link to={`/details?id=${i.book.id}`} className="d-flex align-items-center gap-2 text-decoration-none">
                      <Image src={i.book.image} width={48} rounded />
                      {i.book.title}
                    </Link>
                  </td>
                  <td>{formatPrice(i.book.price)}</td>
                  <td className="text-center text-nowrap">
                    <Button size="sm" variant="outline-secondary" onClick={() => changeQty(i, -1)}>
                      −
                    </Button>
                    <span className="mx-2">{i.quantity}</span>
                    <Button size="sm" variant="outline-secondary" onClick={() => changeQty(i, 1)}>
                      +
                    </Button>
                  </td>
                  <td className="fw-semibold">{formatPrice(i.book.price * i.quantity)}</td>
                  <td>
                    <Button size="sm" variant="outline-danger" onClick={() => remove(i)}>
                      <i className="bi bi-trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
            <span className="fs-5">
              Tổng: <strong className="text-danger">{formatPrice(total)}</strong>
            </span>
            <Button variant="danger" disabled={busy} onClick={checkout}>
              {busy ? <Spinner size="sm" /> : "Thanh toán"}
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
