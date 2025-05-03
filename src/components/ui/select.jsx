import React, { useState, cloneElement, isValidElement } from "react";
import { ChevronDown } from "lucide-react";

export function Select({ children, onValueChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleItemClick = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    onValueChange?.(value);
  };

  return (
    <div className="relative inline-block w-full">
      {React.Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        if (child.type.displayName === "SelectTrigger") {
          return cloneElement(child, {
            onClick: () => setIsOpen((prev) => !prev),
            isOpen,
            selectedValue,
          });
        }

        if (child.type.displayName === "SelectContent") {
          return isOpen
            ? cloneElement(child, {
                onSelect: handleItemClick,
              })
            : null;
        }

        return child;
      })}
    </div>
  );
}


export function SelectTrigger({ children, className = "", isOpen, selectedValue, ...props }) {
  return (
    <button
      className={`flex justify-between items-center border border-gray-300 rounded-lg px-4 py-2 text-sm w-full ${className}`}
      {...props} 
    >
      {children}
      <ChevronDown
        className={`ml-2 w-4 h-4 transform transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
SelectTrigger.displayName = "SelectTrigger";


export function SelectValue({ placeholder, selectedValue }) {
  return (
    <span className={`text-sm ${selectedValue ? "text-black" : "text-gray-500"}`}>
      {selectedValue || placeholder}
    </span>
  );
}
SelectValue.displayName = "SelectValue";

export function SelectContent({ children, onSelect }) {
  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
      {React.Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child, { onClick: () => onSelect(child.props.value) })
          : child
      )}
    </div>
  );
}
SelectContent.displayName = "SelectContent";

export function SelectItem({ value, children, onClick }) {
  return (
    <div
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
      data-value={value}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
