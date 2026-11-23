import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface PageNavItem {
  label: string;
  id: string;
}

interface PageNavDropdownProps {
  items: { label: string; id: string }[];
  onSelect: (id: string) => void;
}

export function PageNavDropdown({ items }: PageNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
      >
        <span>Page Navigation</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(item.id)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}