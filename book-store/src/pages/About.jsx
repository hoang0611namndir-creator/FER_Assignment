import { Card, Col, Container, Row } from "react-bootstrap";

const features = [
  { icon: "bi-truck", title: "Giao hàng nhanh", text: "Giao hàng toàn quốc trong 2–4 ngày." },
  { icon: "bi-shield-check", title: "Sách chính hãng", text: "Cam kết 100% sách có bản quyền." },
  { icon: "bi-arrow-repeat", title: "Đổi trả dễ dàng", text: "Đổi trả miễn phí trong 7 ngày." },
];

export default function About() {
  return (
    <Container>
      <Row className="justify-content-center text-center mb-5">
        <Col lg={8}>
          <h2>Về BookStore</h2>
          <p className="text-muted">
            BookStore là nhà sách online nhỏ, nơi bạn có thể tìm kiếm, lọc theo danh mục, khoảng giá
            và mua những cuốn sách yêu thích chỉ với vài cú nhấp chuột.
          </p>
        </Col>
      </Row>
      <Row className="g-4">
        {features.map((f) => (
          <Col md={4} key={f.title}>
            <Card className="h-100 border-0 shadow-sm text-center p-3">
              <i className={`bi ${f.icon} fs-1 text-primary`} />
              <Card.Body>
                <Card.Title>{f.title}</Card.Title>
                <Card.Text className="text-muted">{f.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
