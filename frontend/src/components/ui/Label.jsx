export function Label({ children, htmlFor, className }) {
  return (
    <label
      className={`block text-base font-medium text-gray-900 mb-2 ${className}`}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
