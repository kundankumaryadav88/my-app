import React from "react";

export function Input({ className = "", ...props }) {
  return <input className={`border border-gray-300 rounded-lg px-4 py-2 text-sm w-full ${className}`} {...props} />;
}