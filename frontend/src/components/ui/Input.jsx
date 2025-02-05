import { forwardRef } from "react";

export const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`w-full px-4 py-2 rounded-lg bg-amber-100/50 border-2 border-amber-500/30 focus:border-amber-600 focus:outline-none mb-4 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
