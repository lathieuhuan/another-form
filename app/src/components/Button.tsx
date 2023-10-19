import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

const colorByVariant = {
  primary: 'bg-light-2 hover:bg-light-2/95',
  default: 'bg-white hover:bg-white/95',
  danger: 'bg-red-400 hover:bg-red-400/90',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'default' | 'danger';
};
export const Button = ({
  type = 'button',
  variant = 'primary',
  className,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx('px-4 py-2 rounded font-medium text-black', colorByVariant[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
};
