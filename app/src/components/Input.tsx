import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

export function Input({ className, value = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx('p-2 rounded text-black focus:bg-light-1', className)}
      value={value}
      {...rest}
    />
  );
}
