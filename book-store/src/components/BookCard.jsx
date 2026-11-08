import { Badge, Card, Ratio } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/format";
import Rating from "./Rating";

export default function BookCard({ book, hot = false }) {
  const navigate = useNavigate();

  return (
    <Card
      role="button" // Bootstrap tự đổi con trỏ thành bàn tay với role="button"
      className="h-100 border-0 shadow-sm"
      onClick={() => navigate(`/details?id=${book.id}`)}
    >
      <div className="position-relative">
        {/* Ratio 140% = tỉ lệ bìa sách 5:7 */}
        <Ratio aspectRatio={140}>
          <Card.Img variant="top" src={book.image} alt={book.title} loading="lazy" className="object-fit-cover" />
        </Ratio>
        {hot && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
            <i className="bi bi-fire me-1" />
            HOT
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6 text-truncate" title={book.title}>
          {book.title}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted small text-truncate">{book.author}</Card.Subtitle>
        <div className="small mb-2">
          <Rating value={book.rating} />
        </div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold text-danger">{formatPrice(book.price)}</span>
          <small className="text-muted">Đã bán {book.sold}</small>
        </div>
      </Card.Body>
    </Card>
  );
}
