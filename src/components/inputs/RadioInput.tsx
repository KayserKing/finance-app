'use client';

import { Path, UseFormRegister } from 'react-hook-form';

interface RadioInputProps<T extends object> {
  register: UseFormRegister<T>;
  name: Path<T>;
  className?: string;
}

const RadioInput = <T extends object>({ register, name, className = '' }: RadioInputProps<T>) => {
  return (
    <div className={`flex gap-4 items-center w-full ${className}`}>
      <label className="flex items-center gap-2 cursor-pointer text-[#004aad] w-full">
        <input
          type="radio"
          value="RECEIVE"
          {...register(name)}
          className="w-4 h-4 text-[#004aad] accent-[#004aad] focus:ring-[#004aad] cursor-pointer"
        />
        Receive
      </label>
      <label className="flex items-center gap-2 cursor-pointer text-[#004aad] w-full">
        <input
          type="radio"
          value="SEND"
          {...register(name)}
          className="w-4 h-4 text-[#004aad] accent-[#004aad] focus:ring-[#004aad] cursor-pointer"
        />
        Send
      </label>
    </div>
  );
};

export default RadioInput;
