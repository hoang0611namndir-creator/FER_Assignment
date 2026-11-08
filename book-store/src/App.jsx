import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Category from "./pages/Category";
import About from "./pages/About";
import Login from "./pages/Login";
import Details from "./pages/Details";
import Cart from "./pages/Cart";
import ErrorPage from "./pages/ErrorPage";
import { useAuth } from "./context/AuthContext";

// Bắt buộc đăng nhập mới vào được trang
function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary">
      <Header />
      <main className="flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/details" element={<Details />} />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage code={404} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
