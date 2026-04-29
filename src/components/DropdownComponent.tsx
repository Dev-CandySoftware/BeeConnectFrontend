import React, { useEffect, useRef, useState } from "react";

interface DropdownProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onSelect: (name: string, value: string) => void;
}

const FormDropdown: React.FC<DropdownProps> = ({
  label,
  name,
  value,
  options,
  onSelect,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelect = (option: string) => {
    onSelect(name, option);
    setDropdownOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative mb-4 block text-xs font-medium text-amber-600"
    >
      <span>{label}</span>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="mt-1 w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        <span>{value || `Selectează ${label}`}</span>
        <span
          className={`transition-transform text-amber-400 ${dropdownOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {dropdownOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-amber-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => handleSelect(opt)}
                className="block w-full px-4 py-2.5 text-left text-sm text-amber-900 hover:bg-amber-50 transition-colors"
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormDropdown;
