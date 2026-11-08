import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppProvider";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { user, logout } = useAuth();
  const { categories } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-book-half me-2" />
          BookStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <NavDropdown title="Category" id="category-dropdown">
              <NavDropdown.Item as={Link} to="/category">
                Tất cả
              </NavDropdown.Item>
              <NavDropdown.Divider />
              {categories.map((c) => (
                <NavDropdown.Item key={c.id} as={Link} to={`/category?cat=${c.id}`}>
                  {c.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
          </Nav>

          <Nav className="align-items-md-center gap-2">
            {user ? (
              <>
                <NotificationBell />
                <Nav.Link as={NavLink} to="/cart">
                  <i className="bi bi-cart3 fs-5" />
                </Nav.Link>
                <span className="text-light small">
                  <i className="bi bi-person-circle me-1" />
                  {user.fullName}
                </span>
                <Button size="sm" variant="outline-light" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Button as={Link} to="/login" size="sm" variant="warning">
                <i className="bi bi-box-arrow-in-right me-1" />
                Đăng nhập
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
