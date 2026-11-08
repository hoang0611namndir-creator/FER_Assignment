import { Pagination } from "react-bootstrap";

export default function Paging({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Pagination className="justify-content-center mt-4">
      <Pagination.First disabled={page === 1} onClick={() => go(1)} />
      <Pagination.Prev disabled={page === 1} onClick={() => go(page - 1)} />
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Pagination.Item key={p} active={p === page} onClick={() => go(p)}>
          {p}
        </Pagination.Item>
      ))}
      <Pagination.Next disabled={page === totalPages} onClick={() => go(page + 1)} />
      <Pagination.Last disabled={page === totalPages} onClick={() => go(totalPages)} />
    </Pagination>
  );
}
