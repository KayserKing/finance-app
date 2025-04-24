'use client';

import { useState, useRef, useEffect } from 'react';

interface SelectOptionsInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  showClear?: boolean;
  searchable?: boolean;
}

const SelectOptionsInput: React.FC<SelectOptionsInputProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  showClear = true,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = searchable
    ? options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchable && search.length > 0) {
      setIsOpen(true);
    }
  }, [search, searchable]);

  const handleMainClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInsideInput = inputRef.current && inputRef.current.contains(target);
    const isButton = target.tagName === 'BUTTON';

    if (!isInsideInput && !isButton) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className={`relative w-full max-w-sm ${className}`} ref={containerRef}>
      <div
        className="w-full h-10 px-4 border border-[0.5px] border-[#004aad] flex items-center justify-between cursor-pointer"
        onClick={handleMainClick}
      >
        <span className="truncate text-[#004aad]">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </span>

        {showClear && value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              setSearch('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
          >
            ✖
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white shadow-md max-h-60 overflow-auto">
          {searchable && (
            <input
              ref={inputRef}
              type="text"
              className="w-full px-3 py-2 text-sm border-b-[0.5px] focus:outline-none"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="px-3 py-2 hover:bg-blue-100 text-sm cursor-pointer"
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-400">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectOptionsInput;
