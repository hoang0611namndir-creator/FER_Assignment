import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import BookList from "../components/BookList";
import { useApp } from "../context/AppProvider";

export default function Category() {
  const [params] = useSearchParams();
  const { getCategoryName } = useApp();
  const name = getCategoryName(params.get("cat"));

  return (
    <Container>
      <BookList title={name ? `Danh mục: ${name}` : "Tất cả danh mục"} />
    </Container>
  );
}
