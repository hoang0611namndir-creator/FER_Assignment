import { Col, Container, Row, Spinner } from "react-bootstrap";
import BookCard from "../components/BookCard";
import BookList from "../components/BookList";
import { useApp } from "../context/AppProvider";

export default function Home() {
  // hotBooks = top 6 sách có lượt mua (sold) cao nhất, tính sẵn trong AppProvider
  const { hotBooks, loading } = useApp();

  return (
    <Container>
      {/* Container sách hot */}
      <section className="bg-warning-subtle rounded-4 p-4 mb-5 shadow-sm">
        <h3 className="mb-3">
          <i className="bi bi-fire text-danger me-2" />
          Sách bán chạy nhất
        </h3>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row xs={2} md={3} lg={6} className="g-3">
            {hotBooks.map((b) => (
              <Col key={b.id}>
                <BookCard book={b} hot />
              </Col>
            ))}
          </Row>
        )}
      </section>

      <BookList title="Tất cả sách" />
    </Container>
  );
}
