import { Button, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function ErrorPage({ code }) {
  const location = useLocation();
  const status = code || location.state?.code || 500;
  const message =
    location.state?.message ||
    (status === 404 ? "Trang bạn tìm kiếm không tồn tại." : "Đã có lỗi xảy ra, vui lòng thử lại.");

  return (
    <Container className="text-center py-5">
      <i className="bi bi-exclamation-triangle-fill text-warning display-1" />
      <h1 className="display-1 fw-bold">{status}</h1>
      <p className="lead text-muted">{message}</p>
      <Button as={Link} to="/">
        <i className="bi bi-house me-1" />
        Về trang chủ
      </Button>
    </Container>
  );
}
