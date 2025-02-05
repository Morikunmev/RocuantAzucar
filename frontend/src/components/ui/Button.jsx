export function Button({ children, className, ...props }) {
  return (
    <button
      className={`relative inline-flex items-center justify-center w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-amber-700 transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
