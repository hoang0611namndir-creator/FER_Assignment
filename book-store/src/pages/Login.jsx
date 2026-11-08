import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sau khi đăng nhập quay về trang trước đó (nếu có)
  const from = location.state?.from
    ? location.state.from.pathname + (location.state.from.search || "")
    : "/";

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username.trim() || !form.password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }
    setLoading(true);
    try {
      const ok = await login(form.username.trim(), form.password);
      if (ok) navigate(from, { replace: true });
      else setError("Sai tên đăng nhập hoặc mật khẩu.");
    } catch {
      setError("Không kết nối được tới server. Hãy chạy json-server (npm run server).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm={10} md={6} lg={4}>
          <Card className="border-0 shadow">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">
                <i className="bi bi-person-lock me-2" />
                Đăng nhập
              </h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Đăng nhập"}
                  </Button>
                </div>
              </Form>
              <p className="text-muted small text-center mt-3 mb-0">
                Tài khoản demo: <code>user</code> / <code>123456</code>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
