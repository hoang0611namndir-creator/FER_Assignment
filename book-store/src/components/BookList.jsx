import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppProvider";
import BookCard from "./BookCard";
import Paging from "./Paging";

const PAGE_SIZE = 8;

/**
 * Danh sách sách + bộ lọc (keyword, category, khoảng giá) + phân trang.
 * Trạng thái bộ lọc được lưu trên URL: ?q=&cat=&min=&max=&page=
 */
export default function BookList({ title = "Tất cả sách" }) {
  // Dữ liệu dùng chung lấy từ AppProvider (đã tải 1 lần từ database.json)
  const { books, categories, loading, error } = useApp();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const q = params.get("q") || "";
  const cat = params.get("cat") || "";
  const min = params.get("min") || "";
  const max = params.get("max") || "";
  const page = Number(params.get("page")) || 1;

  // Ô input keyword/giá giữ state riêng, chỉ áp dụng khi bấm "Lọc"
  const [form, setForm] = useState({ q, min, max });
  useEffect(() => setForm({ q, min, max }), [q, min, max]);

  useEffect(() => {
    if (error) navigate("/error", { state: { message: error } });
  }, [error, navigate]);

  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v === "" || v == null ? next.delete(k) : next.set(k, v)));
    if (!("page" in changes)) next.delete("page"); // đổi bộ lọc thì về trang 1
    setParams(next);
  };

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return books.filter((b) => {
      if (cat && String(b.categoryId) !== cat) return false;
      if (min !== "" && b.price < Number(min)) return false;
      if (max !== "" && b.price > Number(max)) return false;
      if (keyword && !`${b.title} ${b.author}`.toLowerCase().includes(keyword)) return false;
      return true;
    });
  }, [books, q, cat, min, max]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.min !== "" && form.max !== "" && Number(form.min) > Number(form.max)) {
      alert("Giá tối thiểu không được lớn hơn giá tối đa");
      return;
    }
    updateParams({ q: form.q.trim(), min: form.min, max: form.max });
  };

  const reset = () => setParams(new URLSearchParams());

  return (
    <Row className="g-4">
      {/* Cột bộ lọc */}
      <Col lg={3}>
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">
              <i className="bi bi-funnel me-2" />
              Bộ lọc
            </h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Từ khóa</Form.Label>
                <Form.Control
                  placeholder="Tên sách, tác giả..."
                  value={form.q}
                  onChange={(e) => setForm({ ...form, q: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Danh mục</Form.Label>
                <Form.Select value={cat} onChange={(e) => updateParams({ cat: e.target.value })}>
                  <option value="">Tất cả</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Label>Khoảng giá (VNĐ)</Form.Label>
              <Row className="g-2 mb-3">
                <Col>
                  <Form.Control
                    type="number"
                    min={0}
                    placeholder="Từ"
                    value={form.min}
                    onChange={(e) => setForm({ ...form, min: e.target.value })}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    min={0}
                    placeholder="Đến"
                    value={form.max}
                    onChange={(e) => setForm({ ...form, max: e.target.value })}
                  />
                </Col>
              </Row>

              <div className="d-grid gap-2">
                <Button type="submit">
                  <i className="bi bi-search me-1" />
                  Lọc
                </Button>
                <Button variant="outline-secondary" onClick={reset}>
                  Xóa bộ lọc
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      {/* Cột danh sách */}
      <Col lg={9}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">{title}</h4>
          <small className="text-muted">{filtered.length} kết quả</small>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : pageItems.length === 0 ? (
          <Alert variant="info">Không tìm thấy sách phù hợp.</Alert>
        ) : (
          <Row xs={2} md={3} xl={4} className="g-3">
            {pageItems.map((b) => (
              <Col key={b.id}>
                <BookCard book={b} />
              </Col>
            ))}
          </Row>
        )}

        <Paging page={currentPage} totalPages={totalPages} onChange={(p) => updateParams({ page: p })} />
      </Col>
    </Row>
  );
}
