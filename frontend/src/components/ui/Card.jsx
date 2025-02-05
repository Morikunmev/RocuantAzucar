export function Card({ children, className }) {
  return <div className={`rounded-2xl shadow-xl ${className}`}>{children}</div>;
}
