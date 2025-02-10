export function Button({ children, className, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold text-white transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}