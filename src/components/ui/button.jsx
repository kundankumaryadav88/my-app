import React from "react";

export function Button({ children, className = "bg-white", variant = "solid", size = "md", ...props }) {
  const base = "rounded-lg px-4 py-2 text-sm font-medium";
  const variants = {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-600 hover:bg-gray-100",
    active: "text-green-600 bg-green-100",
    inactive: "text-blue-600 bg-blue-100",
    blocked: "text-red-600 bg-red-100",
  };
  
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    icon: "p-2",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}