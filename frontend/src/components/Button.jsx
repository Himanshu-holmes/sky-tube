import React from "react";

export default function Button({
  children,
  type = "button",
  bgColor = "bg-[#ae7aff]",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      className={`px-4 py-3 text-black ${bgColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
