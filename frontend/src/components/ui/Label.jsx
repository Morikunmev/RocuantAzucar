export function Label({ children, className }) {
  return (
    <label className={`block text-sm font-medium text-gray-300 mb-2 ${className}`}>
      {children}
    </label>
  );
}