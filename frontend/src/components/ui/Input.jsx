import { forwardRef } from "react";

export const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`w-full px-4 py-2 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none ${className}`}
      ref={ref}
      {...props}
    />
  );
});