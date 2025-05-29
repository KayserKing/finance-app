'use client'

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const filterOptions = ['INHAND', 'ACCOUNT', 'SEND', 'RECEIVE'];

const MultiSelectFilterDropdown = ({
  onApply,
}: {
  onApply: (selected: string[]) => void;
}) => {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        className="px-2 py-2 rounded-md hover:bg-gray-300 transition cursor-pointer w-10"
        onClick={() => setShow((prev) => !prev)}
      >
        <Image alt='filter' src={'/assets/filter.png'} width={20} height={20} className='' />
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 p-2">
          {filterOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded-md cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              {option}
            </label>
          ))}

          <button
            className="mt-2 w-full bg-[#004aad] text-white px-3 py-1 hover:bg-[#004aad]/90 transition cursor-pointer"
            onClick={() => {
              onApply(selected);
              setShow(false);
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

export default MultiSelectFilterDropdown