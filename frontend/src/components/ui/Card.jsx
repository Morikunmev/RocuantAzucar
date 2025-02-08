export function Card({ children, className }) {
  return (
    <div
      className={`rounded shadow-[0_8px_32px_rgba(0,0,0,0.37)] ${className}`}
    >
      {children}
    </div>
  );
}
