'use client';

import { useEffect, useRef, useState } from 'react';
import { Path, PathValue, UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form';

interface SearchDropdownInputProps<T extends object> {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  options: string[];
  placeholder?: string;
  className?: string;
  trigger: UseFormTrigger<T>;
}

const SearchDropdownInput = <T extends object>({
  register,
  setValue,
  name,
  trigger,
  options,
  placeholder = '',
  className = ''
}: SearchDropdownInputProps<T>) => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setSearch(value);
    setValue(name, value as PathValue<T, typeof name>);
    setShowDropdown(false);
    trigger(name);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        {...register(name)}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        className={`bg-white border-[#004aad] border-[0.5px] w-full px-2 h-10 focus:outline-none pr-10 text-[#004aad] ${className}`}
        autoComplete="off"
      />

      {showDropdown && filteredOptions.length > 0 && (
        <ul ref={dropdownRef} className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white shadow">
          {filteredOptions.map((option, idx) => (
            <li
              key={idx}
              className="px-2 py-2 cursor-pointer hover:bg-[#f0f4ff]"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdownInput;
