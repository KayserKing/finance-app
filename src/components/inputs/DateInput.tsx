'use client';

import { useRef } from 'react';
import { Path, UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface DateInputProps<T extends object> {
    register: UseFormRegister<T>;
    name: Path<T>;
    setValue: UseFormSetValue<T>;
    className?: string;
    placeholder?: string;
}

const DateInput = <T extends object>({
    register,
    name,
    setValue,
    placeholder = '',
    className = '',
}: DateInputProps<T>) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // const handleClick = () => {
    //     inputRef.current?.showPicker?.();
    // };

    const today = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kolkata',
      }).split('T')[0];

    return (
        <div
            className={`relative select-none w-full cursor-pointer`}
            // onClick={handleClick}
        >
            <input
                {...register(name, {
                    onChange: (e) => {
                      setValue(name, e.target.value, { shouldValidate: true });
                    },
                  })}
                ref={inputRef}
                type="date"
                className={`bg-white text-[#004aad] border-[#004aad] border-[0.5px] w-full px-2 h-10 focus:outline-none accent-[#004aad] ${className}`}
                placeholder={placeholder}
                defaultValue={today}
            />
        </div>
    );
};

export default DateInput;
