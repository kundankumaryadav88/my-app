import { ArrowUpDown } from "lucide-react";

export function SortableHeader({ label, sortedBy, onClick }) {
  const key = label.toLowerCase();
  const isActive = sortedBy.key === key;
  const direction = isActive ? sortedBy.direction : null;

  return (
    <div
      onClick={() => onClick(label)}
      className="flex  items-center cursor-pointer space-x-1"
    >
      <span>{label}</span>
      <ArrowUpDown
        className={`w-4 h-4 transition-transform duration-200 text-gray-500 ${
          direction === "asc" ? "rotate-180" : ""
        }`}
      />
    </div>
  );
}
