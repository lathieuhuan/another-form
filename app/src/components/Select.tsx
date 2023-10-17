import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from './icons';

type SelectOption = {
  label: string | number;
  value?: string | number;
  disabled?: boolean;
};

type SelectProps = {
  className?: string;
  value?: string | number;
  placeholder?: string;
  options?: SelectOption[];
  onChange?: (value: string | number | undefined, option: SelectOption) => void;
};
export const Select = ({ className, options = [], placeholder, value, onChange }: SelectProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (value !== localValue) setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (focused) {
      const handleClickOutside = (e: MouseEvent) => {
        if (!ref.current?.contains(e.target as HTMLDivElement)) {
          setFocused(false);
        }
      };
      document.body.addEventListener('click', handleClickOutside);

      return () => {
        document.body.removeEventListener('click', handleClickOutside);
      };
    }
  }, [focused]);

  const finalValue = value ?? localValue;

  const handleClickSelect = () => {
    setFocused((f) => !f);
  };

  const handleClickOption = (option: SelectOption) => {
    const newValue = option.value ?? option.label;
    setLocalValue(newValue);
    onChange?.(newValue, option);
    setFocused(false);
  };

  return (
    <div ref={ref} className={clsx('h-10 text-black relative', className)}>
      <div
        className="pl-3 pr-8 py-2 w-full h-full bg-white rounded select-none"
        onClick={handleClickSelect}
      >
        {finalValue === undefined ? (
          <p className="text-gray-400">{placeholder}</p>
        ) : (
          <p className={clsx(focused && 'text-gray-400')}>
            {options.find((option) => (option.value ?? option.label) === finalValue)?.label ??
              finalValue}
          </p>
        )}
      </div>
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xl"
        aria-hidden="true"
        unselectable="on"
      >
        <ChevronDown />
      </span>

      <div className="pt-1 absolute top-full left-0 right-0">
        {focused ? (
          <div className="p-1 flex flex-col bg-white rounded">
            {options.map((option, i) => {
              return (
                <span
                  key={i}
                  className={clsx(
                    'px-2 py-1 rounded-sm select-none',
                    option.value === finalValue ? 'bg-light-1' : 'hover:bg-gray-200',
                    option.disabled && 'text-gray-400 cursor-not-allowed',
                  )}
                  onClick={() => handleClickOption(option)}
                >
                  {option.label}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};
