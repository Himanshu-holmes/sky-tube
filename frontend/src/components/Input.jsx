import React, { useId } from "react";

const Input = React.forwardRef(
  ({ label, type = "text", className = "", ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1 inline-block text-gray-300 pl-1">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          className={`mb-4 rounded-lg border bg-transparent px-3 py-2 ${className}`}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

export default Input;
