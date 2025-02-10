import { forwardRef } from "react";

export const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none resize-none ${className}`}
      ref={ref}
      {...props}
    >
      {props.children}
    </textarea>
  );
});
