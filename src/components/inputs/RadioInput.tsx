'use client';

import { Path, UseFormRegister } from 'react-hook-form';

interface RadioInputProps<T extends object> {
  register: UseFormRegister<T>;
  name: Path<T>;
  className?: string;
  option1: string;
  option2: string;
}

const RadioInput = <T extends object>({ register, name, option1, option2, className = '' }: RadioInputProps<T>) => {
  return (
    <div className={`flex gap-4 items-center w-full ${className}`}>
      <label className="flex items-center gap-2 cursor-pointer text-[#004aad] w-full">
        <input
          type="radio"
          value={option1}
          {...register(name)}
          className="w-4 h-4 text-[#004aad] accent-[#004aad] focus:ring-[#004aad] cursor-pointer"
        />
        {option1}
      </label>
      <label className="flex items-center gap-2 cursor-pointer text-[#004aad] w-full">
        <input
          type="radio"
          value={option2}
          {...register(name)}
          className="w-4 h-4 text-[#004aad] accent-[#004aad] focus:ring-[#004aad] cursor-pointer"
        />
        {option2}
      </label>
    </div>
  );
};

export default RadioInput;
