import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DateRangeSelectorProps {
  onApply: (range: { from?: Date; to?: Date }) => void;
}

export default function DateRangeSelector({ onApply }: DateRangeSelectorProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleApply = () => {
    setOpen(false);
    onApply({ from: range?.from, to: range?.to });
  };

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="py-1 text-center rounded text-sm cursor-pointer w-6"
      >
        {/* {range?.from && range?.to
          ? `${format(range.from, 'dd MMM yyyy')} - ${format(range.to, 'dd MMM yyyy')}`
          : 'Select Dates'} */}
        <Image
          src="/assets/calendar.png"
          alt="Select Date"
          width={20}
          height={20}
        />
      </button>

      {open && (
        <div className="absolute z-50 bg-white border p-2 mt-2 shadow-xl rounded max-md:right-0">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={1}
            toDate={new Date()}
            showOutsideDays
          />
          <button
            type="button"
            onClick={handleApply}
            disabled={!range?.from || !range?.to}
            className="mt-2 w-full bg-[#004aad] text-white py-1 px-2 rounded text-sm disabled:bg-gray-400"
          >
            Apply
          </button>
        </div>
      )}

    </div>
  );
}
