export function Card({ children, className }) {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
}
