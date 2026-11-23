import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface PageNavItem {
  label: string;
  id: string;
}

interface PageNavDropdownProps {
  items: PageNavItem[];
}

export function PageNavDropdown({ items }: PageNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a 300ms delay before closing the dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div className="sticky top-4 z-40 mb-6 flex justify-end -mt-8">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-[#3d0099] text-white rounded-md hover:bg-[#2e0073] transition-colors shadow-md"
        >
          <span>Page Navigation</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-64 bg-[#ebf4ff] rounded-md shadow-lg border border-gray-200 py-2 z-50">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#cedff3] hover:text-[#000ba3] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}