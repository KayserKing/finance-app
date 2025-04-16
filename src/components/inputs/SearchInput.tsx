'use client';

import Image from 'next/image';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showClear?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  showClear = true,
}) => {

  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-10 pl-10 pr-10 border border-[0.5px] border-[#004aad] focus:outline-none`}
      />
      <Image width={16} height={16} src={'/assets/search.png'} alt='search' className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none' />

      {showClear && value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default SearchInput;
