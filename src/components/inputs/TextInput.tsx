'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Path, UseFormRegister } from 'react-hook-form';

type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'tel'
  | 'url'
  | 'search'
  | 'checkbox'
  | 'radio'
  | 'file';
  
interface TextInputProps<T extends object> {
  register: UseFormRegister<T>;
  name: Path<T>;
  className?: string;
  placeholder: string;
  type: InputType;
}

const TextInput = <T extends object>({ register, name, placeholder, className = '', type }: TextInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative">
      <input
        {...register(name)}
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        className={`bg-white border-[#004aad] border-[0.5px] w-full px-2 h-10 focus:outline-none pr-10 ${className}`}
        placeholder={placeholder}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1"
          tabIndex={-1}
        >
          <Image
            width={20}
            height={20}
            alt={!showPassword ? 'Hide password' : 'Show password'}
            src={!showPassword ? '/assets/eye.png' : '/assets/hidden.png'}
          />
        </button>
      )}
    </div>
  );
};

export default TextInput;
