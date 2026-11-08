// Hiển thị số sao (hỗ trợ nửa sao)
export default function Rating({ value = 0 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let icon = "bi-star";
    if (value >= i) icon = "bi-star-fill";
    else if (value >= i - 0.5) icon = "bi-star-half";
    stars.push(<i key={i} className={`bi ${icon} text-warning`} />);
  }
  return (
    <span>
      {stars} <span className="text-muted ms-1">{value}</span>
    </span>
  );
}
