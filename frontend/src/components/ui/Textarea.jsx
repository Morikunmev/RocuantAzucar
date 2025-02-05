import { forwardRef } from "react";

export const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`w-full px-4 py-2 rounded-lg bg-amber-100/50 border-2 border-amber-500/30 focus:border-amber-600 focus:outline-none mb-4 resize-none ${className}`}
      ref={ref}
      {...props}
    >
      {props.children}
    </textarea>
  );
});
